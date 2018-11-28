import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("file")
export class File extends Item { 
   blob?: UUID
   fileType?: UUID
   subFiles?: { [key: string]:UUID; }
   uti?: string
   utiHierarchy?: [string]
 } 
