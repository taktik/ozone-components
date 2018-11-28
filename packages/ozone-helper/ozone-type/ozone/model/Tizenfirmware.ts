import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("tizenfirmware")
export class Tizenfirmware extends Item { 
   binary?: UUID
   description?: string
   fileName?: string
   size_byte?: number
   swVersion?: string
 } 
