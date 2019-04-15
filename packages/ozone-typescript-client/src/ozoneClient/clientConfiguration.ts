import { OzoneCredentials } from './Credentials'

export interface ClientConfiguration {
	ozoneURL: string
	ozoneInstanceId?: string
	ozoneCredentials?: OzoneCredentials
	webSocketsURL?: string
	defaultTimeout?: number
}
