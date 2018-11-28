import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.doctemplate")
export class FlowrDoctemplate extends Item { 
   attachmentName?: string
   attachmentTemplate?: string
   bodyTemplate?: string
   destination?: string
   identifier?: string
   language?: string
   subjectTemplate?: string
 } 
