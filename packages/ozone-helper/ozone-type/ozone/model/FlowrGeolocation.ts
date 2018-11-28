import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.geolocation")
export class FlowrGeolocation extends Item { 
   address?: string
   latitude?: number
   longitude?: number
 } 
