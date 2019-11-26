import { Blob, UUID } from 'ozone-type'
import { BlobClient } from './blobClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request

export class BlobClientImpl implements BlobClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	async create(data: any): Promise<Blob> {
		const request = new Request(`${this.baseUrl}/rest/v3/blob`)
			.setMethod('PUT')
			.setBody(data)
		return this.client.call<Blob>(request)
	}
	async getById(uuid: string): Promise<Blob> {
		const request = new Request(`${this.baseUrl}/rest/v3/blob/${uuid}`)
			.setMethod('GET')
		return this.client.call<Blob>(request)
	}

	async getDownloadableUrl(id: UUID, fileName: string): Promise<string> {
		return `${this.baseUrl}/rest/v3/blob/${id}/${fileName}`
	}
}