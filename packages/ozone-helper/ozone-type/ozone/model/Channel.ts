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
   restricted: boolean
   scenes?: [string]
   storage?: string
   transcoderEnabled?: boolean
   transcodingEnabled?: boolean
   tvGuideNames?: [string]
   verticalRes?: number
 } 
