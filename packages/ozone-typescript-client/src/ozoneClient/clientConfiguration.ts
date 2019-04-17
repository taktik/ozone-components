import { OzoneCredentials } from '../ozoneCredentials/ozoneCredentials'

export interface ClientConfiguration {
	ozoneURL: string
	ozoneInstanceId?: string
	ozoneCredentials?: OzoneCredentials
	webSocketsURL?: string
	defaultTimeout?: number
}
