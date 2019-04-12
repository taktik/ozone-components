/*
    Main interface for the Ozone Client
    This class manage connection and communication to ozone
*/
import { fsm } from 'typescript-state-machine'
import StateMachine = fsm.StateMachine
import ListenerRegistration = fsm.ListenerRegistration
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request
import InstalledFilter = httpclient.InstalledFilter
import {DeviceMessage, Item} from "ozone-type";
import { ClientState, states, validTransitions } from './clientState'
import { ClientConfiguration } from './clientConfiguration'
import { AuthInfo, OzoneCredentials } from './Credentials'
import { ItemClient } from "./../itemClient/itemClient";
import { RoleClient } from "./../roleClient/roleClient";


export interface OzoneClientInterface extends StateMachine<ClientState> {

	/* Get the client config */
	readonly config: ClientConfiguration

	/* Get the current Authentication if available */
	readonly authInfo?: AuthInfo

	/* Get the last failed login call if any */
	readonly lastFailedLogin?: Response<AuthInfo>

	/*
        Convenience props for getting the status of the client.
    */
	readonly isAuthenticated: boolean
	readonly isConnected: boolean

	/*
        Start the client. To be called once
    */
	start(): Promise<void>

	/*
        The array of filters to apply to all HTTP calls
        BEFORE this OzoneClient's own internal filters.
        This array can be modified at any time to add/remove filters
     */
	readonly preFilters: InstalledFilter[]

	/*
        The array of filters to apply to all HTTP calls
        AFTER this OzoneClient's own internal filters.
        This array can be modified at any time to add/remove filters
     */
	readonly postFilters: InstalledFilter[]

	/*
        Update the WS URL.
        The client will attempt to connect automatically to the new URL.
    */
	updateWSURL(url: string): void

	/*
        Update the Ozone credentials.
        The client will attempt to login automatically.
    */
	updateCredentials(ozoneCredentials: OzoneCredentials): void

	/*
        Stop the client. To be called once
    */
	stop(): Promise<void>

	/*
        Perform a low-level call
        All calls towards Ozone or other Microservices secured by Ozone should use those calls
    */
	callForResponse<T>(request: Request): Promise<Response<T>>

	call<T>(request: Request): Promise<T>

	/*
        Register a message listener.

        @param messageType The type of message to register for
        @param callBack The callBack that will be called
    */
	onMessage<M extends DeviceMessage>(messageType: string, callBack: (message: M) => void): ListenerRegistration

	onAnyMessage(callBack: (message: DeviceMessage) => void): ListenerRegistration

	/*
        Send a message
    */
	send(message: DeviceMessage): void

	// BEGIN HIGH LEVEL CALLS

	/*
        Get a client for working with items of the given type
    */
	itemClient<T extends Item>(typeIdentifier: string): ItemClient<T>

	/*
    	Get a client for working with role
	*/
	roleClient(): RoleClient

	/*
        Insert the current Ozone session ID in the given URL ("/dsid=...).
        This call
        Throws an error if there is no session available.
        The given string may or may not contain the host part.
        Example input strings :
        "/rest/v3/blob"
        "https://taktik.io/rest/v2/media/view/org.taktik.filetype.original/123"
    */
	insertSessionIdInURL(url: string): string
}
