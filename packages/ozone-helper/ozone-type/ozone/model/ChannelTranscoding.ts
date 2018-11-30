import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('channel.transcoding')
export class ChannelTranscoding extends Item {
	audioFormat: string | null
	bitrate: number | null
	bitrateVariation: number | null
	copySubtitles: boolean | null
	deinterlace: boolean | null
	height: number | null
	rotation: string | null
	videoFormat: string | null
	width: number | null

	constructor(src: ChannelTranscoding) {
		super(src)
		this.audioFormat = src.audioFormat
		this.bitrate = src.bitrate
		this.bitrateVariation = src.bitrateVariation
		this.copySubtitles = src.copySubtitles
		this.deinterlace = src.deinterlace
		this.height = src.height
		this.rotation = src.rotation
		this.videoFormat = src.videoFormat
		this.width = src.width
	}
}
