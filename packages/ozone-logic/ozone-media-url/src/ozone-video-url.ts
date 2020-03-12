/**
 * Created by hubert on 21/06/17.
 */
import * as OzoneType from 'ozone-type'
import { OzoneFormat } from 'ozone-config'
import { getDefaultClient } from 'ozone-default-client'
import { OzoneMediaUrl } from './ozone-media-url'

/**
 * JavaScript class to convert media ID to URL
 */
export class OzoneVideoUrl extends OzoneMediaUrl {

	video: OzoneType.FromOzone<OzoneType.Video>
	constructor(video: OzoneType.FromOzone<OzoneType.Video>) {
		super(video.id, getDefaultClient().config.ozoneURL)
		this.video = video
	}

	private async _getVideoFileType(): Promise<Array<OzoneType.FileType>> {
		const fileTypeCache = await getDefaultClient().fileTypeClient().getFileTypeCache()
		const videoFormat = OzoneFormat.priority.video.map(key => OzoneFormat.type[key])
		return fileTypeCache.fileTypes.filter(ft => videoFormat.includes(ft.identifier))
	}

	private _preferredVideoFormat?: string

	async getPreferredVideoFormat(): Promise<string | undefined> {
		if (this._preferredVideoFormat) {
			return this._preferredVideoFormat
		}

		const video = this.video
		let avaliableRessourceId = []
		if (video.file) avaliableRessourceId.push(video.file)
		if (video.derivedFiles) avaliableRessourceId = avaliableRessourceId.concat(video.derivedFiles)

		const fileApi = getDefaultClient().itemClient<OzoneType.File>('file')
		const avaliableRessource = await fileApi.findAllByIds(avaliableRessourceId)

		const videoFileTypes = await this._getVideoFileType()

		for (let format of OzoneFormat.priority.video) {
			const ressourceToUse = avaliableRessource.find((ressource) => {

				const fileType = videoFileTypes.find((videoFileType) => {
					if (videoFileType && videoFileType.id) {
						return videoFileType.id === ressource.fileType
					}
					return false
				})
				const filetypeIdentifier: string = OzoneFormat.type[format]
				if (!fileType) return false
				return fileType.identifier === filetypeIdentifier
			})
			if (ressourceToUse) {
				const fileTypeToUse = videoFileTypes.find((videoFileType) => {
					return videoFileType.id === ressourceToUse.fileType
				})
				if (fileTypeToUse && fileTypeToUse.identifier) {
					this._preferredVideoFormat = fileTypeToUse.identifier
					return this._preferredVideoFormat
				}
			}
		}
	}
	/**
	 * get url where to load the HLS video.
	 * @return {Promise<string>}
	 */
	async getPreferredVideoUrl(): Promise<string> {
		const formatName = await this.getPreferredVideoFormat()
		if (formatName) {
			return this.getVideoUrl(formatName as any)
		} else {
			throw new Error('Video Format is undefined')
		}
	}

}
