import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.epg")
export class FlowrEpg extends Item { 
   timezone?: string
   url?: string
   xslt?: string
 } 
