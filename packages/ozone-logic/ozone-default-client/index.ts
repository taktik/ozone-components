import { OzoneClient } from 'ozone-typescript-client'
import SessionCredentials = OzoneClient.SessionCredentials

let defaultClient: OzoneClient.OzoneClient | undefined = undefined

const sessionCredentials: SessionCredentials = new SessionCredentials()

export function getDefaultClient(clientConfig?: Partial<OzoneClient.ClientConfiguration>): OzoneClient.OzoneClient {
	if (defaultClient === undefined) {
		const urlSearchParams = new URLSearchParams(window.location.search)
		const ozoneUrl: string = urlSearchParams.get('serverURL') || ''
		const config: OzoneClient.ClientConfiguration = {...{
			ozoneURL: `${ozoneUrl}/ozone`,
			ozoneCredentials: sessionCredentials
		}, ...(clientConfig ?? {})}
		defaultClient = OzoneClient.newOzoneClient(config)

		// tslint:disable-next-line
		defaultClient.start() // don't wait client started
	}
	return defaultClient
}
