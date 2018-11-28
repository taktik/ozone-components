import { File } from './File'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel.segment")
export class ChannelSegment extends File { 
   channelId: UUID
   md5: string
   outputId: number
   start: Instant
   stop: Instant
 } 
