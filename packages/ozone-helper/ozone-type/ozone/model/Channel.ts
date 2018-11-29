import { ChannelInput } from './ChannelInput'
import { ChannelOutput } from './ChannelOutput'
import { FlowrLogoitem } from './FlowrLogoitem'
import { RestrictedContent } from './RestrictedContent'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel")
export class Channel extends Item implements RestrictedContent, FlowrLogoitem { 
	aliases?: [string]
	bufferDuration?: number
	cbUrl?: string
	channelType?: string
	channelUuid?: UUID
	defaultPackages?: [string]
	enabled?: boolean
	highlightLogo?: UUID
	horizontalRes?: number
	input?: ChannelInput
	keywords?: [string]
	languageIndexes?: [string]
	languages?: [string]
	logo?: UUID
	multicastUrl?: string
	ottUrl?: string
	output?: ChannelOutput
	restricted?: boolean
	scenes?: [string]
	storage?: string
	transcoderEnabled?: boolean
	transcodingEnabled?: boolean
	tvGuideNames?: [string]
	verticalRes?: number

	constructor(src:Channel) { 
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
