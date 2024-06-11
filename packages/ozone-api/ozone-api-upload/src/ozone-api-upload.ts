import { OzoneConfig } from 'ozone-config'
import { OzoneAPIRequest } from 'ozone-api-request'
import { getDefaultClient } from 'ozone-default-client'
import { OzoneClient } from 'ozone-typescript-client'
import TaskHandlerOption = OzoneClient.TaskHandlerOption
import { Request } from 'typescript-http-client'
import {Blob, UUID} from "ozone-type";
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
 *  const uploader = new UploadFileRequest();
 *  uploader.open();
 *  const formData = new FormData();
 *  formData.append(file.formDataName, file, file.name);
 *  uploader.send(formData);
 * ```
 *
 * ### Events
 * * *ozone-upload-completed*: *CustomEvent*
 *    Fired when upload is complete with detail: {mediaId: uuid}
 *
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

	private async createBlob(file: File): Promise<Blob> {
		try {
			const url = await this._buildUrl('blob')
			const blobRequest = new Request(url).setMethod('PUT').setBody(file)
			blobRequest.timeout = Infinity
			blobRequest.upload.onprogress = this.upload.onprogress
			blobRequest.contentType = 'application/octet-stream'
			return await getDefaultClient().call<Blob>(blobRequest)
		} catch (err) {
			console.error('Error creating blob', err)
			throw err
		}
	}

	private async submitTask(blobId: UUID, fileName: string, options: TaskHandlerOption): Promise<TaskResult | undefined> {
		try {
			const url = await this._buildUrl('task')
			const taskRequest = new Request(url, {
				method: 'POST',
				body: JSON.stringify({
					$type: 'importblobasmedia',
					blob: blobId,
					media: { name: fileName, type: 'media' },
					mediaInputChannel: 'inputChannel'
				})
			})
			const taskId = await getDefaultClient().call<UUID>(taskRequest)
			return await getDefaultClient().taskClient().waitForTask<TaskResult>(taskId, {
				skipWaitingOnSubTask: options.skipWaitingOnSubTask
			}).waitResult
		} catch (err) {
			console.error('Error submit upload task', err)
			throw err
		}
	}

	/**
	 * alias to send method.
	 * @param {FormData} formData
	 * @param {string} folderId
	 * @param options TaskHandlerOption
	 * @return {Promise<string | void>}
	 */
	async uploadFile(formData: FormData, folderId: string = '0', options: TaskHandlerOption = {}): Promise<TaskResult | null> {
		try {
			const file = formData.get('file')
			if (file instanceof File) {
				const blob = await this.createBlob(file)
				if (blob.id) {
					const result = await this.submitTask(blob.id, file.name, options)
					if (!result?.mediaId) {
						console.error('No media define in Ozone')
						return null
					}
					this.status = 200
					this._mediaId = result.mediaId
					this.eventTarget?.dispatchEvent(
						new CustomEvent('ozone-upload-completed',
							{ bubbles: true, detail: { mediaId: result.mediaId } })
					)
					return result
				}
			}
			return null
		} catch (err) {
			this.status = 555
			this._readyState = 4
			console.error(err)
			return null
		}
	}

	_waitForTask(taskId: string, options: TaskHandlerOption): Promise<TaskResult | undefined> {
		const taskClient = getDefaultClient().taskClient()
		const taskHandler = taskClient.waitForTask<TaskResult>(taskId, options)
		return taskHandler.waitResult
	}
}
