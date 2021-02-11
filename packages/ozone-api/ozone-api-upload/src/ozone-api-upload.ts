import { OzoneConfig } from 'ozone-config'
import { OzoneAPIRequest } from 'ozone-api-request'
import { getDefaultClient } from 'ozone-default-client'

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

	/**
	 * alias to send method.
	 * @param {FormData} file
	 * @param {string} folderId
	 * @return {Promise<string | void>}
	 */
	uploadFile(file: FormData, folderId: string = '0'): Promise<TaskResult | null> {

		return this._startUploadSession(file, folderId)
			.then((result) => this._getUploadId(result))
			.then((result) => this._performUpload(result))
			.then((result) => this._endUploadSession(result))
			.then((result) => this._waitForTask(result.uploadFileId))
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

	_waitForTask(taskId: string): Promise<TaskResult | undefined> {
		const taskClient = getDefaultClient().taskClient()
		const taskHandler = taskClient.waitForTask<TaskResult>(taskId, { skipWaitingOnSubTask: true })
		return taskHandler.waitResult
	}
}
