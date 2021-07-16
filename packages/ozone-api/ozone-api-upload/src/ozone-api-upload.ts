import { OzoneConfig } from 'ozone-config'
import { OzoneAPIRequest } from 'ozone-api-request'
import { getDefaultClient } from 'ozone-default-client'
import { OzoneClient } from 'ozone-typescript-client'
import TaskHandlerOption = OzoneClient.TaskHandlerOption
import { Blob as OzoneBlob } from 'ozone-type'

export interface UploadSessionResult {
	file: FormData
	sessionId: string
}

export interface UploadIdResult extends UploadSessionResult {
	uploadId: string
	folderId: string
}

export interface UploadFileId {
	uploadFileId: string
}

export interface UploadEndResult extends UploadIdResult, UploadFileId {
}

export interface TaskResult {
	mediaId: string
	asyncTasksGroupId?: string
}

export interface TaskExecutions {
	completed?: boolean // API v3
	isComplete?: boolean // API v2
	stepsCout: number,
	stepsDone: number,
	taskResult?: TaskResult
}

export interface WaitResponse {
	groupId: string,
	hasErrors: boolean,
	stepsCount: number,
	stepsDone: number,
	taskExecutions: {
		[key: string]: TaskExecutions
	}
}

export interface XMLHttpRequestLike {
	upload: {
		onprogress: { (event: Event): void }
		onloadstart: { (event: Event): void }
	}

	onreadystatechange?: { (): void }

	readonly readyState: number

	readonly status: number

	open(method: string, url: string, async: boolean): void

	send(formData: FormData): void

	abort(): void

	setRequestHeader(key: string, value: string): void
}

/**
 * UploadFileRequest is a JavaScrip class that can be use as an
 * XMLHttpRequest to upload media using ozone v2 upload chanel.
 * It mask the complex series of AJAX call to one XMLHttpRequest like request.
 * Note: that UploadFileRequest implement only a subset of XMLHttpRequest
 *
 * example:
 * ```javaScript
 *  import {UploadFileRequest} from 'ozone-api-upload'
 *  const uploader = new UploadFileRequest()
 *  uploader.open()
 *  const formData = new FormData()
 *  formData.append(file.formDataName, file, file.name)
 *  uploader.send(formData)
 * ```
 *
 * ### Events
 * * *ozone-upload-completed*: *CustomEvent*
 *    Fired when upload is complete with detail: {mediaId: uuid}
 *
 * @deprecated use UploadFileRequestV3 instead
 */
export class UploadFileRequest implements XMLHttpRequestLike {

	/**
	 * Minimalist XMLHttpRequest.upload interface.
	 */
	upload: {
		onprogress: { (event: Event): void }
		onloadstart: { (event: Event): void }
	}

	/**
	 * XMLHttpRequest.onreadystatechange event handler
	 */
		// tslint:disable-next-line:no-empty
	onreadystatechange?: { (): void } = () => {
	}

	private callOneadystatechange() {
		if (typeof (this.onreadystatechange) === 'function') {
			this.onreadystatechange()
		}
	}

	/**
	 * set the interval to verify ozone has finish the element processing
	 * @type {number} poll interval in ms
	 */
	pollInterval: number = 500

	/**
	 * XMLHttpRequest.readyState
	 * @type {number}
	 */
	get readyState(): number {
		return this._internalReadyState
	}

	private set _readyState(readyState: number) {
		this._internalReadyState = readyState
		this.callOneadystatechange()
	}

	private _internalReadyState: number = 0

	/**
	 * XMLHttpRequest.status
	 * @type {number}
	 */
	status: number = NaN

	/**
	 * Set target for dispatchEvent.
	 * @type {Node}
	 */
	eventTarget?: Node

	private _mediaId: string | null = null

	/**
	 * Accessor to uploaded media id.
	 * default value is null
	 *
	 * @return {string | null}
	 */
	get mediaId(): string | null {
		return this._mediaId
	}

	private isAbort: boolean = false
	private currentRequest: OzoneAPIRequest | null = null

	constructor() {
		this.upload = {
			// tslint:disable-next-line:no-empty
			onprogress: () => {},
			// tslint:disable-next-line:no-empty
			onloadstart: () => {}
		}
		try {
			this.eventTarget = document
		} catch (err) {
			console.log(err)
		}
	}

	/**
	 * like an XMLHttpRequest.open()
	 * Parameters passed are not used.
	 * method and URL come from the config file.
	 * Request will always be async.
	 *
	 * @param {string} method
	 * @param {string} url
	 * @param {boolean} async
	 */
	open(method: string, url: string, async: boolean = true) {
		this._readyState = 1
	}

	/**
	 * like an XMLHttpRequest.send()
	 * start async process to upload the file inside the form.
	 * @param {FormData} formData
	 * @return {Promise<void>}
	 */
	async send(formData: FormData) {
		await (this.uploadFile(formData))
	}

	/**
	 * like XMLHttpRequest.abort()
	 * cancel current upload process
	 */
	abort() {
		this.isAbort = true
		if (this.currentRequest) {
			this.currentRequest.abort()
		}
	}

	/**
	 * unused.
	 * @param {string} key
	 * @param {string} value
	 */
	// tslint:disable-next-line:no-empty
	setRequestHeader(key: string, value: string) {
	}

	protected _createRequest(): OzoneAPIRequest {
		if (this.isAbort) {
			throw new Error('request abort')
		}
		this.currentRequest = new OzoneAPIRequest()
		return this.currentRequest
	}

	private async _buildUrl(service: string, ...param: Array<string>): Promise<string> {
		const otherUrlParam = param || []
		const config = await OzoneConfig.get()

		return [
			config.host.replace(/\/$/, ''),
			config.endPoints[service]
				.replace(/\/$/, '')
				.replace(/^\//, ''),
			...otherUrlParam]
			.join('/')
	}

	/**
	 * alias to send method.
	 * @param {FormData} file
	 * @param {string} folderId
	 * @param options TaskHandlerOption
	 * @return {Promise<string | void>}
	 */
	uploadFile(file: FormData, folderId: string = '0', options: TaskHandlerOption = {}): Promise<TaskResult | null> {

		return this._startUploadSession(file, folderId)
			.then((result) => this._getUploadId(result))
			.then((result) => this._performUpload(result))
			.then((result) => this._endUploadSession(result))
			.then((result) => this._waitForTask(result.uploadFileId, options))
			.then((result) => {
				if (!result?.mediaId) {
					throw Error('No media define in Ozone')
				}
				this.status = 200
				this._readyState = 4

				this._mediaId = result.mediaId

				if (this.eventTarget) {
					this.eventTarget.dispatchEvent(
						new CustomEvent('ozone-upload-completed',
							{ bubbles: true, detail: { mediaId: result.mediaId } })
					)
				}
				return result
			}).catch((error: Error) => {
				this.status = 555
				this._readyState = 4
				console.error(error.message)
				return null
			})
	}

	private notifyOnError(): ((this: XMLHttpRequest, ev: Event) => any) {
		const self = this
		return function(this: XMLHttpRequest, ev: Event) {
			if (this.status === 0
				|| this.status >= 500
				|| this.status >= 400) {
				self.status = this.status
				self._readyState = 4
			}
		}
	}

	async _startUploadSession(file: FormData, folderId: string): Promise<UploadSessionResult> {
		const request = this._createRequest()
		request.url = await this._buildUrl('uploadStart')
		request.method = 'POST'

		request.onreadystatechange = this.notifyOnError()

		const config = await OzoneConfig.get()
		const body = {
			mediaUploadChannelIdentifier: config.uploadChannel,
			autoCommit: false
		}
		request.body = JSON.stringify(body)
		return request.sendRequest()
			.then((xhr: XMLHttpRequest) => {
				const response = xhr.response
				return {
					file: file,
					sessionId: response.result as string
				}
			})
	}

	async _getUploadId(data: UploadSessionResult): Promise<UploadIdResult> {
		const request = this._createRequest()
		request.url = await this._buildUrl('uploadId', data.sessionId)
		request.method = 'GET'

		request.onreadystatechange = this.notifyOnError()

		return request.sendRequest()
			.then((xhr: XMLHttpRequest) => {
				const response = xhr.response
				const resultInfo: UploadIdResult = data as UploadIdResult
				resultInfo.uploadId = response.result
				resultInfo.folderId = response.folderId
				return resultInfo
			})
	}

	async _performUpload(data: UploadIdResult): Promise<UploadIdResult> {
		const request = this._createRequest()
		request.url = await this._buildUrl('upload', data.uploadId)
		request.method = 'POST'

		request.onreadystatechange = this.notifyOnError()
		const xhr = request.createXMLHttpRequest(false)
		xhr.upload.onprogress = this.upload.onprogress

		request.body = data.file
		return request.sendRequest(xhr)
			.then(() => {
				return data
			})
	}

	async _endUploadSession(data: UploadIdResult): Promise<UploadEndResult> {
		const request = this._createRequest()
		request.url = await this._buildUrl('uploadComplete', data.sessionId)
		request.method = 'POST'

		request.onreadystatechange = this.notifyOnError()
		const info = {
			'selectedFileFieldNames': [['files']],
			mediaMetadatas: [
				{
					type: { type: 'PROPERTY', identifier: 'org.taktik.metadata.folderId' },
					valueObject: data.folderId
				}
			]
		}
		request.body = JSON.stringify(info)

		return request.sendRequest()
			.then((xhr: XMLHttpRequest) => {
				const response: UploadEndResult = data as UploadEndResult
				response.uploadFileId = xhr.response.file
				return response
			})
	}

	_waitForTask(taskId: string, options: TaskHandlerOption): Promise<TaskResult | undefined> {
		const taskClient = getDefaultClient().taskClient()
		const taskHandler = taskClient.waitForTask<TaskResult>(taskId, options)
		return taskHandler.waitResult
	}
}

interface IFlowrAdmin {
	config: {
		ozoneApi: {
			blob: string
		}
	}
	getSessionId: () => string,
}

// V3 upload
interface IChunk {
	start: number
	end: number
	blob: Blob
	isUploaded: boolean
}

export class UploadFileRequestV3 {
	private readonly app: any
	private readonly chunkSize: number

	public events: {
		uploadStart?: (file: File) => void
		uploadProgress?: (progress: number) => void
		uploadFinish?: (...args: any) => void
		uploadError?: (uploadHelperId: string, error: string) => void
	} = {}

	public readonly id: string
	public uploadHelperId?: string

	private file?: File
	private chunksToUpload: IChunk[] = []
	private currentChunk?: IChunk
	private ozoneBlobId?: string
	private fetchController: AbortController
	private isAborted: boolean
	private isPaused: boolean

	constructor(app: any, chunkSize?: number) {
		this.id = this.generateId()
		this.app = app
		this.chunkSize = chunkSize ?? (1024 * 1024)
		this.fetchController = new AbortController()
		this.isAborted = false
		this.isPaused = false
	}

	generateId(): string {
		return 'uploader_' + Math.random().toString(36).substr(2, 9)
	}

	async uploadFile(file: File): Promise<any> {
		try {
			this.file = file
			this.chunksToUpload = this.chunkify(file)
			await this.processFileUpload()
		} catch (e) {
			console.error(e)
		}
	}

	notifyUploadError(error: string) {
		if (this.uploadHelperId) {
			this.events?.uploadError?.(this.uploadHelperId, error)
		}

		console.error(error)
	}

	notifyUploadStart() {
		if (this.file) {
			this.events?.uploadStart?.(this.file)
		}
	}

	notifyUploadProgress() {
		const totalChunks = this.chunksToUpload.length
		const uploadedChunk = this.chunksToUpload.filter(c => c.isUploaded).length

		return this.events?.uploadProgress?.((uploadedChunk / totalChunks) * 100)
	}

	async processFileUpload(): Promise<void> {
		try {
			const isLastChunkUploaded = await this.processChunkUpload()

			if (isLastChunkUploaded) {
				await this.finalizeOzoneBlob()
			}
		} catch (e) {
			console.error(e)
		}
	}

	async processChunkUpload(): Promise<boolean> {
		try {
			if (this.isAborted || this.isPaused) {
				return false
			}

			const nextChunkData = this.getNextChunkData()
			let appendResult

			if (nextChunkData) {
				const { index, chunk } = nextChunkData

				if (index === 0) {
					const ozoneBlob = await this.createOzoneBlob(chunk)
					this.ozoneBlobId = ozoneBlob?.id
				}

				if (index !== 0) {
					appendResult = await this.appendOzoneBlob(index, chunk)
				}

				if (index === 0 || (index !== 0 && appendResult)) {
					this.markChunkAsUploaded(index)
					this.notifyUploadProgress()
				} else {
					console.log('Chunk not uploaded correctly: ', index, appendResult, chunk)
					const currentChunkIndex = this.chunksToUpload.findIndex(chunk => (
						chunk.start === this.currentChunk?.start
					)) ?? 0

					if (currentChunkIndex > 0) {
						this.currentChunk = this.chunksToUpload[currentChunkIndex - 1]
					}
				}

				return await this.processChunkUpload()
			}

			return true
		} catch (e) {
			this.notifyUploadError(e.message)
			return false
		}
	}

	async createOzoneBlob(chunk: IChunk): Promise<OzoneBlob | undefined> {
		try {
			const sessionId = await this.app.getSessionId()

			const url = `${this.app.config.ozoneApi.blob}?partial=true&storageUnit=00000000-4416-827f-0000-000000000065`
			this.notifyUploadStart()

			const response = await fetch(url, {
				method: 'PUT',
				body: chunk.blob,
				headers: {
					'Ozone-Session-Id': sessionId
				}
			})

			return await response.json() as OzoneBlob
		} catch (e) {
			this.notifyUploadError(e.message)
		}
	}

	async appendOzoneBlob(index: number, chunk: IChunk): Promise<OzoneBlob | undefined> {
		try {
			console.log(`Uploading chunk ${index}: `, chunk)
			const sessionId = await this.app.getSessionId()
			const url = `${this.app.config.ozoneApi.blob}/${this.ozoneBlobId}`

			const response = await fetch(url, {
				method: 'PUT',
				body: chunk.blob,
				headers: {
					'Ozone-Session-Id': sessionId
				},
				signal: this.fetchController.signal
			})

			return await response.json() as OzoneBlob
		} catch (e) {
			if (e instanceof DOMException && e.name === 'AbortError') {
				console.warn('Upload aborted')
			} else {
				this.notifyUploadError(e.message)
			}
		}
	}

	async finalizeOzoneBlob() {
		// All the chunks are uploaded, lock the blob
		try {
			const sessionId = await this.app.getSessionId()

			return fetch(`${this.app.config.ozoneApi.blob}/${this.ozoneBlobId}`, {
				method: 'POST',
				headers: {
					'Ozone-Session-Id': sessionId
				}
			})
		} catch (e) {
			this.notifyUploadError(e.message)
		}
	}

	/**
	 * When pausing the upload, the request can have been partially executed and so, the blob can have been uploaded
	 * partially. This method re-fetch the whole blob and re-chunkify the file depending on the size that has been
	 * uploaded
	 */
	/*async regenerateChunksToUpload(): Promise<void> {
		try {
			if (!this.file) return

			const sessionId = await this.app.getSessionId()

			const blobRequest = await fetch(`${this.app.config.ozoneApi.blob}/${this.ozoneBlobId}`, {
				method: 'GET',
				headers: {
					'Ozone-Session-Id': sessionId
				}
			})

			const blob = await blobRequest.json()
			const uploadedSize = blob.size
			const fileChunksOfUploadedSize = this.chunkify(this.file, uploadedSize).map(chunk => chunk.blob)
			const partialFile = new File(fileChunksOfUploadedSize.slice(1), this.file.name, {
				type: this.file.type
			})

			this.currentChunk = undefined
			this.chunksToUpload = this.chunkify(partialFile)
		} catch (e) {
			console.error(e)
		}
	}*/

	getNextChunkData(): { index: number, chunk: IChunk } | null {
		const currentChunkIndex = this.currentChunk
			? this.chunksToUpload.findIndex((chunk => chunk.start === this.currentChunk?.start))
			: -1

		const nextChunkIndex = currentChunkIndex + 1

		if (nextChunkIndex > this.chunksToUpload.length - 1) {
			return null
		}

		this.currentChunk = this.chunksToUpload[nextChunkIndex]

		return { index: nextChunkIndex, chunk: this.currentChunk }
	}

	markChunkAsUploaded(index: number): IChunk {
		this.chunksToUpload[index].isUploaded = true
		return this.chunksToUpload[index]
	}

	chunkify (file: File, chunkSize: number = this.chunkSize) {
		let chunks: IChunk[] = []
		let chunksCount = Math.ceil(file.size / chunkSize)
		let chunkedSize = 0

		Array.from(Array(chunksCount)).forEach(() => {
			const chunkEnd = Math.min(chunkedSize + chunkSize, file.size)
			const chunk = file.slice(chunkedSize, chunkEnd, file.type)

			chunks = [
				...chunks,
				{
					start: chunkedSize,
					end: chunkEnd,
					blob: chunk,
					isUploaded: false
				}
			]

			chunkedSize += chunkSize

			if (chunkedSize > file.size) {
				chunkedSize = file.size
			}
		})

		return chunks
	}

	abort(isInPauseContext: boolean = false): void {
		this.fetchController.abort()

		if (!isInPauseContext) {
			this.isAborted = true

			this.app.getSessionId().then((sessionId: string) => {
				fetch(`${this.app.config.ozoneApi.blob}/${this.ozoneBlobId}`, {
					method: 'DELETE',
					headers: {
						'Ozone-Session-Id': sessionId
					}
				}).catch(e => console.error('Could not delete blob', e))
			})
		}
	}

	pause(): void {
		this.abort(true)
		this.isPaused = true
	}

	resume(): void {
		this.isPaused = false
		this.fetchController = new AbortController()
		this.processFileUpload().catch(e => console.error(e))

		/*this.regenerateChunksToUpload().then(() => {
			this.processFileUpload().catch(e => console.error(e))
		})*/
	}

	retry(): void {
		throw new Error('not implemented')
	}
}
