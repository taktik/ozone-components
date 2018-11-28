import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("passingtime")
export class Passingtime extends Item { 
   expectedArrivalTime?: Instant
   lineId?: number
   pointId?: number
 } 
