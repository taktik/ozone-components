import { OzoneAPIRequest } from 'ozone-api-request'
import * as Config from 'ozone-config'

/**
 * OzoneApiAuthentication class to manage Authentication API
 * Low level wrapper around ozone login, logout and authentication api
 * It use OzoneAPIRequest to perform ajax request. Report to OzoneAPIRequest documentation for fire events.
 * @deprecated
 * ### Usage
 *
 * ```javascript
 * import {OzoneApiAuthentication, getOzoneApiAuthentication} from 'ozone-api-authentication'
 * ```
 */
export class OzoneApiAuthentication {

	private configPromise: Promise<Config.ConfigType>
	constructor(config?: Config.ConfigType) {
		if (config) {
			this.configPromise = Promise.resolve(config)
		} else {
			this.configPromise = Config.OzoneConfig.get()
		}
	}

	private eventTarget?: EventTarget

	/**
	 * Set event target to redirect OzoneAPIRequest events to an other target.
	 * @param {EventTarget} element
	 */
	setEventTarget(element: EventTarget) {
		this.eventTarget = element
	}

	/**
	 * connect to ozone
	 * @return {Promise<XMLHttpRequest>}
	 */
	async ozoneConnect(username: string, password: string): Promise<XMLHttpRequest> {

		const config = await this.configPromise
		const request = new OzoneAPIRequest()
		if (this.eventTarget) {
			request.setEventTarget(this.eventTarget)
		}
		request.method = 'POST'
		request.url = config.host + config.endPoints.login
		request.body = JSON.stringify({
			username,
			password
		})
		return request.sendRequest()
	}

	/**
	 * ozone logout
	 * @return {Promise<XMLHttpRequest>}
	 */
	async logout(): Promise<XMLHttpRequest> {
		const config = await this.configPromise

		const request = new OzoneAPIRequest()
		if (this.eventTarget) {
			request.setEventTarget(this.eventTarget)
		}
		request.method = 'GET'
		request.url = config.host + config.endPoints.logout

		return request.sendRequest()
	}

	/**
	 * Verify ozone connection
	 * @return {Promise<boolean>}
	 */
	async checkConnectionStatus(): Promise<boolean> {
		const config = await this.configPromise

		const request = new OzoneAPIRequest()
		if (this.eventTarget) {
			request.setEventTarget(this.eventTarget)
		}
		request.method = 'GET'
		request.url = config.host + config.endPoints.session

		const response = await request.sendRequest()

		if (response.response && response.response.sessionId) {
			return true
		} else {
			return false
		}
	}
}

/**
 * OzoneApiAuthentication factory
 * @return {OzoneApiAuthentication}
 */
export const getOzoneApiAuthentication = function(config?: Config.ConfigType): OzoneApiAuthentication {
	return new OzoneApiAuthentication(config)
}
