import * as clientState from './ozoneClient/clientState'
import * as ozoneCredentials from './ozoneCredentials/ozoneCredentials'
import * as ozoneCredentialsImpl from './ozoneCredentials/ozoneCredentialsImpl'
import * as itemClient from './itemClient/itemClient'
import * as roleClient from './roleClient/roleClient'
import * as clientConfiguration from './ozoneClient/clientConfiguration'
import * as ozoneClient from './ozoneClient/ozoneClient'
import * as permissionClient from './permissionClient/permissionClient'
import * as typeClient from './typeClient/typeClient'
import { OzoneClientImpl } from './ozoneClient/ozoneClientImpl'

export namespace OzoneClient {

	export import ClientState = clientState.ClientState

	export const states = clientState.states

	export import OzoneClient = ozoneClient.OzoneClient

	export import SearchResults = itemClient.SearchResults

	export import ItemClient = itemClient.ItemClient

	export import PermissionClient = permissionClient.PermissionClient

	export import RoleClient = roleClient.RoleClient

	export import TypeClient = typeClient.TypeClient

	/*
		Factory method
	*/
	export function newOzoneClient(config: ClientConfiguration) {
		return new OzoneClientImpl(config)
	}

	export import AuthInfo = ozoneCredentials.AuthInfo

	export import OzoneCredentials = ozoneCredentials.OzoneCredentials

	export import SessionCredentials = ozoneCredentialsImpl.SessionCredentials

	export import UserCredentials = ozoneCredentialsImpl.UserCredentials

	export import TokenCredentials = ozoneCredentialsImpl.TokenCredentials

	export import ItemCredentials = ozoneCredentialsImpl.ItemCredentials

	export import ItemByQueryCredentials = ozoneCredentialsImpl.ItemByQueryCredentials

	export import ClientConfiguration = clientConfiguration.ClientConfiguration
}
