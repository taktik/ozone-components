import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request
import newHttpClient = httpclient.newHttpClient
import { AuthInfo, OzoneCredentials } from './ozoneCredentials'

export class SessionCredentials implements OzoneCredentials {
	async authenticate(ozoneURL: string): Promise<AuthInfo> {
		const httpClient = newHttpClient()
		const request = new Request(`${ozoneURL}/rest/v3/authentication/current/session`)
			.set({
				method: 'GET',
				withCredentials: true
			})
		let authInfo = await (httpClient.call<AuthInfo>(request))
		if (!authInfo) {
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
		return Promise.reject('Not implemented')
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
