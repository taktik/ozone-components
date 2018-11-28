import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.update")
export class DeviceMessageUpdate extends DeviceMessage { 
   firmwareId: UUID
 } 
