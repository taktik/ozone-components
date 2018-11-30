import { FlowrGeolocation } from './FlowrGeolocation'
import { FlowrRemoteControlSettings } from './FlowrRemoteControlSettings'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.frontend.settings')
export class FlowrFrontendSettings extends Item {
	audioLanguage: string | null
	autoUpdate: boolean | null
	bootPageId: UUID | null
	flowrRemoteControlSettings: FlowrRemoteControlSettings | null
	interfaceLanguage: string | null
	lastChannelId: UUID | null
	location: FlowrGeolocation | null
	maxVolume: number | null
	preferredContent: UUID[] | null
	startVolume: number | null
	subtitlesLanguage: string | null
	user: UUID | null

	constructor(src: FlowrFrontendSettings) {
		super(src)
		this.audioLanguage = src.audioLanguage
		this.autoUpdate = src.autoUpdate
		this.bootPageId = src.bootPageId
		this.flowrRemoteControlSettings = src.flowrRemoteControlSettings
		this.interfaceLanguage = src.interfaceLanguage
		this.lastChannelId = src.lastChannelId
		this.location = src.location
		this.maxVolume = src.maxVolume
		this.preferredContent = src.preferredContent
		this.startVolume = src.startVolume
		this.subtitlesLanguage = src.subtitlesLanguage
		this.user = src.user
	}
}
