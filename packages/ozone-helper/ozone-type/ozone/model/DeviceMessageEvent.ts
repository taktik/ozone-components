import { DeviceEvent } from './DeviceEvent'
import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.event")
export class DeviceMessageEvent extends DeviceEvent { 
   message: DeviceMessage
   users?: [UUID]
 } 
