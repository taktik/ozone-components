import { Blob, UUID } from 'ozone-type'
export type UploadParams = {
	onprogress?: {
		(event: Event): void;
	};
	onloadstart?: {
		(event: Event): void;
	};
}
export interface BlobClient {
	create(data: any, uploadParams?: UploadParams): Promise<Blob>

	getById(id: UUID): Promise<Blob>

	getDownloadableUrl(id: UUID, fileName: string): Promise<string>
}
