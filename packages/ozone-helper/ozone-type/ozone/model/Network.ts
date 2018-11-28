import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("network")
export class Network extends Item { 
   address: string
   dns?: UUID
   netmask: string
   websocketUrl?: string
 } 
