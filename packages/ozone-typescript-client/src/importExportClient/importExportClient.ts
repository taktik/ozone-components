import { ExportSpec, UUID } from 'ozone-type'

export interface ImportExportClient {
	/**
	 * Launch an Export Task to export items and associated data, return the task id
	 */
	createExport(exportSpec: ExportSpec): Promise<UUID>

	/**
	 * request a export and return the export ID ones it's ready
	 */
	exportAndWaitForCompeted(exportSpec: ExportSpec): Promise<UUID>

	/**
	 * get the download URL from exportId
	 */
	getDownloadExportUrl(exportId: UUID): string

	/**
	 * Import zip archive to ozone
	 */
	uploadImport(zipFile: Blob): Promise<void>

}
