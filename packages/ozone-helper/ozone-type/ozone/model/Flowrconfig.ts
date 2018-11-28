import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowrconfig")
export class Flowrconfig extends Item { 
   backendVersion?: number
   rootFolder?: UUID
 } 
