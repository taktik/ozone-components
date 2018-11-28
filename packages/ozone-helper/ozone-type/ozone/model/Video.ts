import { FlowrLogoitem } from './FlowrLogoitem'
import { FlowrVod } from './FlowrVod'
import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("video")
export class Video extends Media implements FlowrLogoitem, FlowrVod { 
   actors?: string
   editors?: string
   episodeNumber?: number
   genre?: string
   groupingId?: string
   highlight?: boolean
   highlightLogo?: UUID
   language?: string
   logo?: UUID
   parentalGuidance?: number
   presentators?: string
   realisators?: string
   seasonNumber?: number
   subTitle?: { [key: string]: string; }
   vodType?: string
   year?: number
 } 
