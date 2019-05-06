import { OzoneClient } from 'ozone-typescript-client'
import SessionCredentials = OzoneClient.SessionCredentials

let defaultClient: OzoneClient.OzoneClient | undefined = undefined

const sessionCredentials: SessionCredentials = new SessionCredentials()

export function getDefaultClient(): OzoneClient.OzoneClient {
	const config: OzoneClient.ClientConfiguration = {
		ozoneURL: `${location.hostname}/ozone`,
		ozoneCredentials: sessionCredentials
	}
	if (defaultClient === undefined) {
		defaultClient = OzoneClient.newOzoneClient(config)
	}
	return defaultClient
}

export function setDefaultClient(client: OzoneClient.OzoneClient): void {
	defaultClient = client
}
