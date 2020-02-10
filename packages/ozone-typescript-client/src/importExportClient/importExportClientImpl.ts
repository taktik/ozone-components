import { Blob, ExportSpec, UUID } from 'ozone-type'
import { ImportExportClient, ArchiveType } from './importExportClient'
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

	async exportAndWaitForCompeted(exportSpec: ExportSpec): Promise<ArchiveType | undefined> {
		const taskId = await this.createExport(exportSpec)
		const taskHandler = this.client.taskClient().waitForTask<ArchiveType>(taskId)
		return taskHandler.waitResult
	}

	getDownloadExportUrl(exportId: UUID): string {
		return `${this.baseUrl}/rest/v3/export/download/${exportId}`
	}

	uploadImport(zipFile: Blob): Promise<UUID> {
		const request = new Request(`${this.baseUrl}/rest/v3/import/upload`)
			.setMethod('POST')
			.setTimeout(UPLOAD_TIMEOUT)
			.setBody(zipFile)
		request.contentType = 'application/octet-stream'
		return this.client.call<string>(request)
	}

	async uploadImportAndWaitForCompeted(zipFile: Blob): Promise<void> {
		const taskId = await this.uploadImport(zipFile)
		const taskHandler = this.client.taskClient().waitForTask<any>(taskId)
		return taskHandler.waitResult
	}
}
