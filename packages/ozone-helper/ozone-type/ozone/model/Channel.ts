import { ChannelInput } from './ChannelInput'
import { ChannelOutput } from './ChannelOutput'
import { FlowrLogoitem } from './FlowrLogoitem'
import { RestrictedContent } from './RestrictedContent'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('channel')
export class Channel extends Item implements RestrictedContent, FlowrLogoitem {
	aliases: string[] | null
	bufferDuration: number | null
	cbUrl: string | null
	channelType: string | null
	channelUuid: UUID | null
	defaultPackages: string[] | null
	enabled: boolean | null
	highlightLogo: UUID | null
	horizontalRes: number | null
	input: ChannelInput | null
	keywords: string[] | null
	languageIndexes: string[] | null
	languages: string[] | null
	logo: UUID | null
	multicastUrl: string | null
	ottUrl: string | null
	output: ChannelOutput | null
	restricted: boolean | null
	scenes: string[] | null
	storage: string | null
	transcoderEnabled: boolean | null
	transcodingEnabled: boolean | null
	tvGuideNames: string[] | null
	verticalRes: number | null

	constructor(src: Channel) {
		super(src)
		this.aliases = src.aliases
		this.bufferDuration = src.bufferDuration
		this.cbUrl = src.cbUrl
		this.channelType = src.channelType
		this.channelUuid = src.channelUuid
		this.defaultPackages = src.defaultPackages
		this.enabled = src.enabled
		this.highlightLogo = src.highlightLogo
		this.horizontalRes = src.horizontalRes
		this.input = src.input
		this.keywords = src.keywords
		this.languageIndexes = src.languageIndexes
		this.languages = src.languages
		this.logo = src.logo
		this.multicastUrl = src.multicastUrl
		this.ottUrl = src.ottUrl
		this.output = src.output
		this.restricted = src.restricted
		this.scenes = src.scenes
		this.storage = src.storage
		this.transcoderEnabled = src.transcoderEnabled
		this.transcodingEnabled = src.transcodingEnabled
		this.tvGuideNames = src.tvGuideNames
		this.verticalRes = src.verticalRes
	}
}
