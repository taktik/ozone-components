import { httpclient } from 'typescript-http-client'

//
import * as clientState from './ozoneClient/clientState'
import * as Credencial from './ozoneClient/Credentials'
import * as itemClient from './itemClient/itemClient'
import * as roleClient from './roleClient/roleClient'
import * as clientConfiguration from './ozoneClient/clientConfiguration'
import * as ozoneClient from './ozoneClient/ozoneClient'
import * as permissionClient from './permissionClient/permissionClient'
import * as typeClient from './typeClient/typeClient'
import { OzoneClientImpl } from './ozoneClient/ozoneClientImpl'

export namespace OzoneClient {
	import Response = httpclient.Response
	import Request = httpclient.Request
	import newHttpClient = httpclient.newHttpClient

	export import ClientState = clientState.ClientState

	export const states = clientState.states

	export import OzoneClient = ozoneClient.OzoneClient

	export import SearchResults = itemClient.SearchResults

	export import ItemClient = itemClient.ItemClient

	export import PermissionClient = permissionClient.PermissionClient

	export import FieldsPermission = permissionClient.FieldsPermission

	export import RoleClient = roleClient.RoleClient

	export import TypeClient = typeClient.TypeClient

	export interface AuthInfo extends Credencial.AuthInfo {}

	/*
		Factory method
	*/
	export function newOzoneClient(config: ClientConfiguration) {
		return new OzoneClientImpl(config)
	}

	export import OzoneCredentials = Credencial.OzoneCredentials

	export class UserCredentials extends OzoneCredentials {
		constructor(readonly username: string,
					readonly password: string) {
			super()
		}

		authenticate(ozoneURL: string): Promise<AuthInfo> {
			return Promise.reject('Not implemented')
		}
	}

	export class TokenCredentials extends OzoneCredentials {
		constructor(readonly token: string) {
			super()
		}

		authenticate(ozoneURL: string): Promise<AuthInfo> {
			return Promise.reject('Not implemented')
		}
	}

	export class ItemCredentials extends OzoneCredentials {
		constructor(readonly itemId: string,
					readonly secret: string) {
			super()
		}

		authenticate(ozoneURL: string): Promise<AuthInfo> {
			return Promise.reject('Not implemented')
		}
	}

	export class SessionCredentials extends OzoneCredentials {
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

	export class ItemByQueryCredentials extends OzoneCredentials {

		constructor(readonly typeIdentifier: string,
					readonly secret: string,
					readonly query: object) {
			super()
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

	export import ClientConfiguration = clientConfiguration.ClientConfiguration
}
