import { IUploadFile, UploadMediaError } from './models'
import { Queue } from './Queue'
import { Blob, ModeType, File as OzoneFile } from 'ozone-type'
import { getDefaultClient } from 'ozone-default-client'
import { SearchQuery } from 'ozone-search-helper'

type OnStartUploadFunction = (params: { id: string; percent: number; file: File }) => void
type OnEndBlobUploadFunction = (params: { id: string }) => void
type OnEndImportBlobAsMediaFunction = (params: { oldId: string; newId?: string }) => void
type OnProgressEventFunction = (id: string) => (progressEvent: Event) => void
type OnErrorUploadMediaFunction = (params: { id: string; error: UploadMediaError }) => void
type OnEndOfUploadFunction = (params: { id: string }) => void
type CheckIfMediaExistsParam = {
	mode?: ModeType
	tenant: string
}

type ImportBlobAsMediaTaskResult = {
	mediaId: string
	asyncTasksGroupId?: string
}

type BlobRequest = {
	blob: Blob
	file: File
	id: string
}

export type ImportBlobParams = {
	$type: string
	mediaInputChannel: string
}
const defaultImportBlobParams: ImportBlobParams = {
	$type: 'importblobasmedia',
	mediaInputChannel: 'inputChannel'
}

type Item = {file?: string, id?: string} & object
export class OzoneApiUploadV3<T extends Item = Item> {
	private onStartUpload?: OnStartUploadFunction
	private onEndBlobUpload?: OnEndBlobUploadFunction
	private onEndImportBlobAsMedia?: OnEndImportBlobAsMediaFunction
	private onEndUpload?: OnEndOfUploadFunction
	private onProgress?: OnProgressEventFunction
	private onErrorUploadMedia?: OnErrorUploadMediaFunction
	private setMedia: (media: T) => void
	private collection: string
	private readonly createBlobMaxRetry: number
	private readonly importTaskMaxRetry: number
	private blobQueue = new Queue<void>(5)
	private importBlobParams: ImportBlobParams
	private importTaskQueue = new Queue<void>(10)
	private checkIfMediaExists?: CheckIfMediaExistsParam
	private metaData?: Partial<T>
	constructor({
					onStartUpload,
					onEndBlobUpload,
					onProgress,
					createBlobMaxRetry = 5,
					onErrorUploadMedia,
					onEndUpload,
					importBlobParams = defaultImportBlobParams,
					importTaskMaxRetry = 10,
					onEndImportBlobAsMedia,
					setMedia,
					collection,
					checkIfMediaExists,
					metaData
	}: {
		onStartUpload?: OnStartUploadFunction
		onEndBlobUpload?: OnEndBlobUploadFunction
		onProgress?: OnProgressEventFunction
		onEndImportBlobAsMedia?: OnEndImportBlobAsMediaFunction
		createBlobMaxRetry?: number
		onErrorUploadMedia?: OnErrorUploadMediaFunction
		importBlobParams?: ImportBlobParams
		importTaskMaxRetry?: number
		onEndUpload?: OnEndOfUploadFunction
		setMedia: (media: T) => void
		collection: string
		checkIfMediaExists?: CheckIfMediaExistsParam
		metaData?: Partial<T>
	}) {
		this.onStartUpload = onStartUpload
		this.onEndBlobUpload = onEndBlobUpload
		this.onProgress = onProgress
		this.onErrorUploadMedia = onErrorUploadMedia
		this.onEndImportBlobAsMedia = onEndImportBlobAsMedia
		this.onEndUpload = onEndUpload
		this.createBlobMaxRetry = createBlobMaxRetry
		this.importBlobParams = importBlobParams
		this.importTaskMaxRetry = importTaskMaxRetry
		this.setMedia = setMedia
		this.collection = collection
		this.checkIfMediaExists = checkIfMediaExists
		this.metaData = metaData
	}

	/* Create blob files and put import task in stack "importingTasks"
     * @param files
     * @private
     */
	private createBlobs(files: IUploadFile[]) {
		files.forEach(({ id, file }) => {
			this.onStartUpload?.({ id, percent: 0, file })
		})

		const createBlobTask = async (file: File, id: string, attempt = 1): Promise<void> => {
			try {
				const blob = await getDefaultClient().blobClient().create(file, {
					onprogress: this.onProgress?.(id)
				})
				this.onEndBlobUpload?.({ id: id })
				this.importTaskQueue.push([() => this.submitBlobTask({ blob, file, id })])
			} catch (err) {
				if (attempt >= this.createBlobMaxRetry) {
					this.onErrorUploadMedia?.({
						id,
						error: UploadMediaError.UPLOAD
					})
				} else {
					return createBlobTask(file, id, attempt + 1)
				}
			}
		}
		const blobRequests = files.map(
			({ file, id }) =>
				() =>
					createBlobTask(file, id)
		)
		this.blobQueue.push(blobRequests)
	}

	submitBlobTask(params: BlobRequest) {
		let fileId = params?.id
		if (!params) {
			return Promise.resolve()
		}
		const media = {...{
			name: params.file.name,
			type: 'media'
		}, ...(this.metaData ? this.metaData : {})}

		const generateTask = async (attempt = 1): Promise<void> => {
			try {
				const taskId = await getDefaultClient().taskClient().submitTask(JSON.stringify({
					$type: this.importBlobParams.$type,
					blob: params.blob.id,
					media,
					mediaInputChannel: this.importBlobParams.mediaInputChannel
				}))
				const result = await getDefaultClient().taskClient().waitForTask<ImportBlobAsMediaTaskResult>(taskId, {
					skipWaitingOnSubTask: true
				}).waitResult

				this.onEndImportBlobAsMedia?.({
					oldId: fileId,
					newId: result?.mediaId
				})
				if (result?.mediaId) {
					fileId = result.mediaId
				}
				if (result?.asyncTasksGroupId && result?.mediaId) {
					await this.waitForThumbnails(result.asyncTasksGroupId, result.mediaId)
				}
			} catch (err) {
				console.log('Error submit upload task', err)
				if (attempt >= this.importTaskMaxRetry) {
					if (fileId) {
						this.onErrorUploadMedia?.({
							id: fileId,
							error: UploadMediaError.IMPORTING
						})
					}
				} else {
					return generateTask(attempt + 1)
				}
			}
		}
		return generateTask()
	}

	private waitForThumbnails = (tasksGroupId: string, mediaId: string) => {
		const func = (resolve: () => void, reject: () => void, attemptThumbnails = 1) => {
			const onSuccess = async () => {
				const media = await getDefaultClient().itemClient<T>(this.collection).findOne(mediaId)
				if (media) {
					this.setMedia(media)
				}
				this.onEndUpload?.({ id: mediaId })
				resolve()
			}
			const onError = () => {
				if (attemptThumbnails >= this.importTaskMaxRetry) {
					reject()
				} else {
					return func(resolve, reject, attemptThumbnails + 1)
				}
			}
			this.waitUntilEndOfUpload(tasksGroupId, onSuccess, onError)
		}
		return new Promise<void>((resolve, reject) => {
			func(resolve, reject)
		})
	}

	/* Will wait until the end of upload
	 * generation of thumbnails ...
	 * @param task - the task id
	 * @param callBack - executed once the task is completed
	 */
	private waitUntilEndOfUpload(
		task: string,
		callBack?: ({ taskId }: { taskId?: string }) => void | Promise<void>,
		onError?: ({ taskId }: { taskId?: string }) => void | Promise<void>
	) {
		const taskClient = getDefaultClient().taskClient()
		const taskHandle = taskClient.waitForTask(task)
		taskHandle.onFinish = callBack
		taskHandle.onError = onError
	}

	private async getIfMediaExists(file: File): Promise<T | undefined> {
		try {
			if (this.checkIfMediaExists) {
				const querySearchByName = new SearchQuery().and.termQuery('name', file.name).tenantQuery(this.checkIfMediaExists.mode ?? 'OWN_AND_PARENTS',this.checkIfMediaExists.tenant)
				const { results: medias = [] } = await getDefaultClient().itemClient<T>(this.collection).search(querySearchByName.searchRequest)
				if (!medias.length) { // not exists
					return undefined
				}
				const fileIds = medias.map(media => media.file).filter(Boolean) as string[]
				const files = (await getDefaultClient().itemClient<OzoneFile>('file').findAllByIds(fileIds)).filter(ozoneFile => !ozoneFile.deleted)
				if (!files.length) {
					return undefined
				}
				const existingFiles = await Promise.all(files.map(async ozoneFile => {
					if (ozoneFile.blob) {
						const blob = await getDefaultClient().blobClient().getById(ozoneFile.blob)
						if (blob?.size === file.size) {
							return ozoneFile
						}
					}
					return null
				}).filter(ozoneFile => ozoneFile)) as OzoneFile[]

				const randomFile = existingFiles[0]
				return medias.find(media => media.file === randomFile?.id)
			}
			return undefined
		} catch (err) {
			console.error('Error getting media if exists', err)
			return undefined
		}

	}
	/* Upload several medias
     * Firstly start create blobs
     * @param files
     */
	uploadFiles(files: IUploadFile[]) {
		Promise.all(files.map(async (file) => {
			const mediaAlreadyExists = await this.getIfMediaExists(file.file)
			if (mediaAlreadyExists) {
				this.onEndImportBlobAsMedia?.({
					oldId: file.id,
					newId: mediaAlreadyExists.id
				})
				this.setMedia(mediaAlreadyExists)
				return null // not create blob
			}
			return file
		})).then((files) => {
			this.createBlobs(files.filter(file => file) as IUploadFile[])
		}).catch(err => {
			console.error('Error uploading medias', err)
		})
	}
}
