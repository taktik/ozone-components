import { ExportSpec, UUID, ImportSpec } from 'ozone-type'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request

export interface ArchiveType {
	archiveId: UUID,
	archiveSize: number
}
export interface UploadRequest<T> {
	result: Promise<T>,
	request: Request
}

export interface ImportExportClient {
	/**
	 * Launch an Export Task to export items and associated data, return the task id
	 */
	createExport(exportSpec: ExportSpec, progressCallback?: (event: Event) => void): Promise<UUID>

	/**
	 * request an export and return the export ID once it's ready
	 */
	exportAndWaitForCompleted(exportSpec: ExportSpec): Promise<ArchiveType | undefined>

	/**
	 * get the download URL from exportId
	 */
	getDownloadExportUrl(exportId: UUID): string

	/**
	 * Import zip archive to ozone, return the task id
	 */
	uploadImport(zipFile: Blob, options?: ImportSpec, progressCallback?: (event: Event) => void): UploadRequest<UUID>

	/**
	 * Import zip archive to ozone
	 */
	uploadImportAndWaitForCompleted(zipFile: Blob, options?: ImportSpec): Promise<void>

}
