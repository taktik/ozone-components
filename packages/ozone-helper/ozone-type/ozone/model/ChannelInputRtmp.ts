import { ChannelInput } from './ChannelInput'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel.input.rtmp")
export class ChannelInputRtmp extends ChannelInput { 
   port: number
 } 
