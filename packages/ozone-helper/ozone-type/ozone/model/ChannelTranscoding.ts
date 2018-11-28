import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("channel.transcoding")
export class ChannelTranscoding extends Item { 
   audioFormat: string
   bitrate?: number
   bitrateVariation?: number
   copySubtitles: boolean
   deinterlace: boolean
   height?: number
   rotation?: string
   videoFormat: string
   width?: number
 } 
