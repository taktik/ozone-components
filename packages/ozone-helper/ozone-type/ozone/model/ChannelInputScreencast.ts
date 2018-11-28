import { ChannelInput } from './ChannelInput'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel.input.screencast")
export class ChannelInputScreencast extends ChannelInput { 
   timeZone?: string
   url: string
 } 
