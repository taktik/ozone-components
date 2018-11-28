import { ChannelInput } from './ChannelInput'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel.input.multicast")
export class ChannelInputMulticast extends ChannelInput { 
   url: string
 } 
