import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("subscription")
export class Subscription extends Item { 
   action?: UUID
   description?: string
   devices?: [UUID]
   endDate?: Instant
   isActive: boolean
   startDate?: Instant
 } 
