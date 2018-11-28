import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("vehicleposition")
export class Vehicleposition extends Item { 
   directionId?: number
   distanceFromPoint?: number
   lineId?: number
   pointId?: number
 } 
