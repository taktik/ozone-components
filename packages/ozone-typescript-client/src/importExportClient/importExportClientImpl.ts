import { Blob, ExportSpec, UUID, ImportSpec } from 'ozone-type'
import { ImportExportClient, ArchiveType, UploadRequest } from './importExportClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request
const UPLOAD_TIMEOUT = 600000 // let 10min max to upload the archive
export class ImportExportClientImpl implements ImportExportClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	createExport(exportSpec: ExportSpec): Promise<UUID> {
		const request = new Request(`${this.baseUrl}/rest/v3/export/create`)
			.setMethod('POST')
			.setTimeout(UPLOAD_TIMEOUT)
			.setBody(exportSpec)

		return this.client.call<string>(request)
	}

	async exportAndWaitForCompleted(exportSpec: ExportSpec): Promise<ArchiveType | undefined> {
		const taskId = await this.createExport(exportSpec)
		const taskHandler = this.client.taskClient().waitForTask<ArchiveType>(taskId)
		return taskHandler.waitResult
	}

	getDownloadExportUrl(exportId: UUID): string {
		return `${this.baseUrl}/rest/v3/export/download/${exportId}`
	}

	uploadImport(zipFile: Blob, options: ImportSpec = {}, progressCallback?: (event: Event) => void): UploadRequest<UUID> {
		const optionsQuery = new URLSearchParams(options as any)
		const request = new Request(`${this.baseUrl}/rest/v3/import/upload?${optionsQuery.toString()}`)
			.setMethod('POST')
			.setTimeout(UPLOAD_TIMEOUT)
			.setBody(zipFile)
		request.contentType = 'application/octet-stream'
		if (progressCallback) {
			request.upload.onprogress = progressCallback
		}
		return {
			result: this.client.call<string>(request),
			request
		}
	}

	async uploadImportAndWaitForCompleted(zipFile: Blob, options?: ImportSpec): Promise<void> {
		const uploadRequest = this.uploadImport(zipFile, options)
		const taskId = await uploadRequest.result
		const taskHandler = this.client.taskClient().waitForTask<void>(taskId)
		return taskHandler.waitResult
	}
}
