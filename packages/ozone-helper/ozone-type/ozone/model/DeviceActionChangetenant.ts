import { DeviceAction } from './DeviceAction'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.action.changetenant")
export class DeviceActionChangetenant extends DeviceAction { 
   tenantId: UUID
 } 
