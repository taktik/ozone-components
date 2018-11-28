import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("article")
export class Article extends Item { 
   category?: UUID
   description?: { [key: string]: string; }
   index?: number
   localizedName?: { [key: string]: string; }
   logo?: UUID
   price?: number
 } 
