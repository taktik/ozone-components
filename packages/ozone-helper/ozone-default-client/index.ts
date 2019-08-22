import { OzoneClient } from 'ozone-typescript-client'
import SessionCredentials = OzoneClient.SessionCredentials

let defaultClient: OzoneClient.OzoneClient | undefined = undefined

const sessionCredentials: SessionCredentials = new SessionCredentials()

export function getDefaultClient(): OzoneClient.OzoneClient {
	if (defaultClient === undefined) {
		const config: OzoneClient.ClientConfiguration = {
			ozoneURL: 'ozone',
			ozoneCredentials: sessionCredentials
		}
		defaultClient = OzoneClient.newOzoneClient(config)

		// tslint:disable-next-line
		defaultClient.start() // don't wait client started
	}
	return defaultClient
}
