import { FlowrLogoitem } from './FlowrLogoitem'
import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("audio")
export class Audio extends Media implements FlowrLogoitem { 
   highlightLogo?: UUID
   logo?: UUID
 } 
