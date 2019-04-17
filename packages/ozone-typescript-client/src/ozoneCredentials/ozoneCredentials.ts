import { httpclient } from 'typescript-http-client'

export interface AuthInfo {
	principalClass: string,
	principalId: string,
	sessionId: string,
}

export interface OzoneCredentials {
	authenticate(ozoneURL: string): Promise<AuthInfo>
}
