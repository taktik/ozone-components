import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("recording")
export class Recording extends Item { 
   channelId: UUID
   duration?: number
   start: Instant
   stop: Instant
   video?: UUID
 } 
