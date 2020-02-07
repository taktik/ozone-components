import {Blob, ExportSpec, UUID} from 'ozone-type'
import { ImportExportClient } from './importExportClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request

export class ImportExportClientImpl implements ImportExportClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	createExport(exportSpec: ExportSpec): Promise<UUID> {
		const request = new Request(`${this.baseUrl}/rest/v3/export/create`)
			.setMethod('POST')
			.setBody(exportSpec)
		return this.client.call<string>(request)
	}

	async exportAndWaitForCompeted(exportSpec: ExportSpec): Promise<UUID> {
		const taskId = await this.createExport(exportSpec)
		const taskHandler = this.client.taskClient().waitForTask<string>(taskId)
		return taskHandler.waitResult
	}

	getDownloadExportUrl(exportId: UUID): string {
		return `${this.baseUrl}/rest/v3/export/download/${exportId}`
	}

	uploadImport(zipFile: Blob): Promise<void> {
		const request = new Request(`${this.baseUrl}/rest/v3/import/upload`)
			.setMethod('POST')
			.setBody(zipFile)
		request.contentType = 'application/octet-stream'
		return this.client.call<void>(request)
	}
}
