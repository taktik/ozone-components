import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("survey")
export class Survey extends Item { 
   category?: UUID
   index?: number
   question?: { [key: string]: string; }
 } 
