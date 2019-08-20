import { OzoneClient } from 'ozone-typescript-client'
import SessionCredentials = OzoneClient.SessionCredentials

let defaultClient: OzoneClient.OzoneClient | undefined = undefined

const sessionCredentials: SessionCredentials = new SessionCredentials()

export function getDefaultClient(): OzoneClient.OzoneClient {
	if (defaultClient === undefined) {
		const config: OzoneClient.ClientConfiguration = {
			ozoneURL: 'ozone', //https://test.flowr.dev/
			ozoneCredentials: sessionCredentials
		}
		defaultClient = OzoneClient.newOzoneClient(config)
		setTimeout(async () => {
			if (defaultClient) {
				await defaultClient.start()
			}
		})
	}
	return defaultClient
}
