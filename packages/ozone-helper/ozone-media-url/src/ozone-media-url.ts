/**
 * Created by hubert on 21/06/17.
 */
import * as OzoneType from 'ozone-type'
import { FlowrImageEnum, FlowrVideoEnum } from 'ozone-config'

export type SizeEnum = Number

export class OzonePreviewSize {
	static Small: SizeEnum = 250
	static Medium: SizeEnum = 500
	static Large: SizeEnum = 1500
}

/**
 * class to convert media ID to URL
 */
export class OzoneMediaUrl {

	id: OzoneType.UUID
	constructor(id: OzoneType.UUID, private ozoneHost: string) {
		this.id = id
	}

	/**
	 * Convert uuid to ozone v2 numeric id
	 * @return {number}
	 */
	getNumericId(): number {
		// tslint:disable-next-line:radix
		return parseInt('0x' + this.id.split('-')[4])
	}
	private _buildBaseUrl(...action: Array<string | number>): string {
		return `${this.ozoneHost}${action.join('/')}`
	}
	private _buildViewUrl(action: Array<string | number>): string {
		return `${this.ozoneHost}/view/${action.join('/')}`
	}

	/**
	 * get url to jpg preview
	 * @param {SizeEnum} size
	 * @return {string}
	 */
	getPreviewUrlJpg(size: SizeEnum): string {
		const preview = FlowrImageEnum.jpg.replace('{SIZE}', size.toString())
		return this
			._buildViewUrl([this.getNumericId(), preview])

	}

	/**
	 * return url to original content
	 * @return {string}
	 */
	getOriginalFormat(): string {
		return this.getVideoUrl(FlowrVideoEnum.original)
	}

	/**
	 * return url to png preview
	 * @param {SizeEnum} size
	 * @return {string}
	 */
	getPreviewUrlPng(size: SizeEnum): string {
		const preview = FlowrImageEnum.png.replace('{SIZE}', size.toString())
		return this
			._buildViewUrl([this.getNumericId(), preview])

	}

	/**
	 * return url to image preview
	 * @param {SizeEnum} size
	 * @return {string}
	 */
	async getPreviewUrl(size: SizeEnum): Promise<string> {
		// TODO default is png
		return this.getPreviewUrlJpg(size)
	}

	/**
	 * get url where to load the HLS video.
	 * @return {Promise<string>}
	 */
	getVideoUrl(formatName?: FlowrVideoEnum): string {
		const format = formatName || FlowrVideoEnum.flowr
		return this
			._buildViewUrl([this.getNumericId(),
				format,
				'index.m3u8'])
	}

	/**
	 * retun unt to the mp4 file
	 * @return {string}
	 */
	getVideoUrlMp4(): string {
		const format = FlowrVideoEnum.mp4
		return this
			._buildViewUrl([this.getNumericId(),
				format])
	}
}
