export type OzoneAPIRequestOption = {
	cache: boolean
}

/**
 * OzoneAPIRequest is a light wrapper over XMLHttpRequest to manager AJAX request to Ozone.
 *
 * ### Events
 *
 * * *ozone-api-request-success* Fired when connection to ozone succeeds.
 * Event detail contains the XMLHttpRequest.
 *
 * * *ozone-api-request-error* Fired when connection to ozone fails.
 * Event detail contains the XMLHttpRequest.
 *
 * * *ozone-api-request-timeout* Fired when connection timeout.
 * Event detail contains the XMLHttpRequest.
 *
 * * *ozone-api-request-unauthorized* Fired when server return 403 unauthorized.
 * Event detail contains the XMLHttpRequest.
 * deprecated
 *
 * ### Usage
 *
 * * Basic usage with promise
 * ```typeScript
 * const ozoneAPIRequest = new OzoneAPIRequest();
 * ozoneAPIRequest.url = url;
 * ozoneAPIRequest.method = 'GET';
 * ozoneAPIRequest.sendRequest()
 *    .then((res:XMLHttpRequest) => {
 *        // Do something with XMLHttpRequest
 *        console.log(res.response)
 *    })
 *    .catch((failRequest)=>{
 *        // Do something with XMLHttpRequest to handel the error.
 *        console.error(failRequest.statusText)
 *    })
 * ```
 *
 *
 * * Usage with Event handler
 * ```typeScript
 * this.addEventListener('ozone-api-request-success', (event: Event) => {
 *        // Do something with XMLHttpRequest
 *        console.log(event.detail.response)
 *    })
 * this.addEventListener('ozone-api-request-error', (event: Event) => {
 *        // Do something with XMLHttpRequest to handel the error.
 *        console.error(event.detail.statusText)
 *    })
 * const ozoneAPIRequest = new OzoneAPIRequest();
 * ozoneAPIRequest.setEventTarget(this)
 * ozoneAPIRequest.url = url;
 * ozoneAPIRequest.method = 'GET';
 * ozoneAPIRequest.sendRequest();
 * ```
 *
 * * Modify request before send
 * ```typeScript
 * const ozoneAPIRequest = new OzoneAPIRequest();
 * ozoneAPIRequest.url = url;
 * ozoneAPIRequest.method = 'GET';
 * const request = ozoneAPIRequest.createXMLHttpRequest();
 * // Modify default request
 * request.setRequestHeader('Cache-Control', 'only-if-cached');
 *
 * ozoneAPIRequest.sendRequest(request);
 * // Handel response
 * ```
 * * Setup global options
 *
 *  * ```typeScript
 * OzoneAPIRequest.setup({ cache: false })
 * ```
 */
export class OzoneAPIRequest {

	private static option: OzoneAPIRequestOption = {
		cache: true
	}
	/**
	 * eventTarget to dispatch *ozone-api-request-success* and *ozone-api-request-error* events
	 * Default value is document.
	 * @type {EventTarget}
	 */
	eventTarget: EventTarget | null
	private _resultPromise?: Promise<XMLHttpRequest>
	private currentRequest: XMLHttpRequest | null = null
	private resolveCurrentRequest?: { (...param: Array<any>): void }

	constructor() {
		try {
			// should not work for nodejs
			this.eventTarget = document
		} catch (err) {
			this.eventTarget = null
		}
	}

	public url: string = ''

	private _method: string = 'GET'

	get method(): string {
		return this._method
	}

	set method(method: string) {
		this._method = method
	}

	private _body: string | FormData = ''

	get body(): string | FormData {
		return this._body
	}

	set body(body: string | FormData) {
		this._body = body
	}

	private _responseType: XMLHttpRequestResponseType = 'json'

	get responseType(): XMLHttpRequestResponseType {
		return this._responseType
	}

	set responseType(responseType: XMLHttpRequestResponseType) {
		this._responseType = responseType
	}

	/**
	 * Resolve with current XMLHttpRequest on achieved
	 */
	get result(): Promise<XMLHttpRequest> {
		if (this._resultPromise) {
			return this._resultPromise
		} else {
			throw new Error('Request has not been send')
		}
	}

	private _onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null = null

	set onreadystatechange(callback: ((this: XMLHttpRequest, ev: Event) => any)) {
		this._onreadystatechange = callback
	}

	get readyState(): number {
		if (this.currentRequest) {
			return this.currentRequest.readyState
		} else {
			return 0
		}
	}

	/**
	 * setup OzoneAPIRequest global option.
	 * @param option: OzoneAPIRequestOption default value { cache: false }
	 */
	static setup(option: OzoneAPIRequestOption) {
		OzoneAPIRequest.option = option
	}

	abort() {
		if (this.currentRequest) {
			this.currentRequest.abort()
		}
		if (this.resolveCurrentRequest) {
			this.resolveCurrentRequest(this.currentRequest)
		}
	}

	/**
	 * Create and open an XMLHttpRequest
	 * @return {XMLHttpRequest}
	 */
	createXMLHttpRequest(withHeader: boolean = true): XMLHttpRequest {
		const xmlhttp = new XMLHttpRequest()
		xmlhttp.withCredentials = true

		xmlhttp.open(this.method, this.url, true)
		xmlhttp.responseType = this.responseType
		if (withHeader) {
			xmlhttp.setRequestHeader('Content-Type', 'application/json')
			xmlhttp.setRequestHeader('Accept', 'application/json')
		}
		return xmlhttp
	}

	setEventTarget(element: EventTarget) {
		this.eventTarget = element
	}

	/**
	 *
	 * @param {XMLHttpRequest} request (optional) This parameters overwrite the default XmlHttpRequest.
	 * @return {OzoneAPIRequest}
	 */
	send(request?: XMLHttpRequest): OzoneAPIRequest {
		const xmlhttp = this.currentRequest = request || this.createXMLHttpRequest()

		if (this._onreadystatechange) {
			xmlhttp.onreadystatechange = this._onreadystatechange
		}

		this._resultPromise = new Promise((resolve, reject) => {
			this.resolveCurrentRequest = resolve

			const handleResponse = () => {
				if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
					this.dispatchEvent('ozone-api-request-success', xmlhttp)
					resolve(xmlhttp)
				} else if (xmlhttp.status === 403) {
					this.dispatchEvent('ozone-api-request-unauthorized', xmlhttp)
					reject(xmlhttp)
				} else {
					this.dispatchEvent('ozone-api-request-error', xmlhttp)
					reject(xmlhttp)
				}
			}

			xmlhttp.onload = handleResponse

			xmlhttp.ontimeout = () => {
				this.dispatchEvent('ozone-api-request-timeout', xmlhttp)
				reject(xmlhttp)
			}

			xmlhttp.onerror = handleResponse

			xmlhttp.send(this.body)
		})
		return this
	}

	/**
	 *
	 * @param {XMLHttpRequest} request (optional) This parameters overwrite the default XmlHttpRequest.
	 * @return {Promise<XMLHttpRequest>}
	 */
	sendRequest(request?: XMLHttpRequest): Promise<XMLHttpRequest> {
		return this.send(request).result

	}

	private dispatchEvent(eventName: string, xmlhttp: XMLHttpRequest) {
		if (this.eventTarget) {
			this.eventTarget.dispatchEvent(new CustomEvent<XMLHttpRequest>(eventName, {
				bubbles: true, detail: xmlhttp
			}))
		}
	}
}
