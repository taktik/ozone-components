import { Event } from './Event'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.event")
export class DeviceEvent extends Event { 
   devices?: [UUID]
   network?: UUID
 } 
