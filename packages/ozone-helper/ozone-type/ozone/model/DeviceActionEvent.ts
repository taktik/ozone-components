import { DeviceAction } from './DeviceAction'
import { DeviceEvent } from './DeviceEvent'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.action.event")
export class DeviceActionEvent extends DeviceEvent { 
   action: DeviceAction
 } 
