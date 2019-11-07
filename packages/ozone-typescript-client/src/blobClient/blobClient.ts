import { Blob, UUID } from 'ozone-type'

export interface BlobClient {
	create(data: any): Promise<Blob>

	getById(id: UUID): Promise<Blob>

	getDownloadableUrl(id: UUID, fileName: string): Promise<string>
}
