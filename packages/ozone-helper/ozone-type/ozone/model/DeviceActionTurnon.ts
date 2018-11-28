import { DeviceAction } from './DeviceAction'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.action.turnon")
export class DeviceActionTurnon extends DeviceAction { 
   ttl?: number
 } 
