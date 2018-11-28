import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("documenttemplate")
export class Documenttemplate extends Item { 
   destination?: string
   template?: string
 } 
