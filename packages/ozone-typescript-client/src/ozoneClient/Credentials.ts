
export interface AuthInfo {
	principalClass: string,
	principalId: string,
	sessionId: string,
}

export abstract class OzoneCredentials {
	abstract authenticate(ozoneURL: string): Promise<AuthInfo>
}
