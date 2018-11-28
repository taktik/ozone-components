import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("eshop.order")
export class EshopOrder extends Item { 
   body: string
   creationDate: Instant
   device: UUID
 } 
