import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request
import newHttpClient = httpclient.newHttpClient
import { AuthInfo, OzoneCredentials } from '../ozoneClient/ozoneClient'

export class SessionCredentials implements OzoneCredentials {
	async authenticate(ozoneURL: string): Promise<AuthInfo> {
		const httpClient = newHttpClient()
		const request = new Request(`${ozoneURL}/rest/v3/authentication/current/session`)
			.set({
				method: 'GET',
				withCredentials: true
			})
		let authInfo = await (httpClient.call<AuthInfo>(request))
		if (!authInfo['principalId']) {
			// The session is invalid
			throw new Response<AuthInfo>(request, 403, 'Invalid session', {}, authInfo)
		}
		return authInfo
	}
}

export class UserCredentials implements OzoneCredentials {
	constructor(readonly username: string,
				readonly password: string) {
	}

	authenticate(ozoneURL: string): Promise<AuthInfo> {
		const httpClient = newHttpClient()
		const request = new Request(`${ozoneURL}/rest/v3/authentication/login/user`)
			.setMethod('POST')
			.setBody({
				username: this.username,
				password: this.password
			})
		return httpClient.call<AuthInfo>(request)
	}
}

export class TokenCredentials implements OzoneCredentials {
	constructor(readonly token: string) {
	}

	authenticate(ozoneURL: string): Promise<AuthInfo> {
		return Promise.reject('Not implemented')
	}
}

export class ItemCredentials implements OzoneCredentials {
	constructor(readonly itemId: string,
				readonly secret: string) {
	}

	authenticate(ozoneURL: string): Promise<AuthInfo> {
		return Promise.reject('Not implemented')
	}
}

export class ItemByQueryCredentials implements OzoneCredentials {

	constructor(readonly typeIdentifier: string,
				readonly secret: string,
				readonly query: object) {
	}

	async authenticate(ozoneURL: string): Promise<AuthInfo> {
		const httpClient = newHttpClient()
		const request = new Request(`${ozoneURL}/rest/v3/authentication/login/item/${this.typeIdentifier}`)
			.set({
				method: 'POST',
				body: {
					query: this.query,
					secret: this.secret
				}
			})
		return (httpClient.call<AuthInfo>(request))
	}
}

/**
 * Performs a redirection to ozone's login page if no active session is found
 */
export class OzoneLoginCredentials extends SessionCredentials {
	private static isInBrowser(): boolean {
		return !!window && !!window.location
	}

	private redirectToLoginPage(ozoneURL: string): void {
		if (OzoneLoginCredentials.isInBrowser()) {
			const loginUrl = new URL(`${ozoneURL}/login`)
			loginUrl.searchParams.set('target', window.location.href)
			window.location.replace(loginUrl.href)
		} else {
			throw Error('Not in a browser, redirection can\'t be performed. You probably want to use another type of OzoneCredentials.')
		}
	}

	constructor() {
		super()

		if (!OzoneLoginCredentials.isInBrowser()) {
			throw Error('Not in a browser, you probably want to use another type of OzoneCredentials.')
		}
	}

	async authenticate(ozoneURL: string): Promise<AuthInfo> {
		try {
			return await super.authenticate(ozoneURL)
		} catch (e) {
			if (e.status === 403) {
				this.redirectToLoginPage(ozoneURL)
			}
			throw e
		}
	}
}
