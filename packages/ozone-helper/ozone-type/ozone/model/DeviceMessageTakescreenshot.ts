import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.takescreenshot")
export class DeviceMessageTakescreenshot extends DeviceMessage { 
   delay?: [number]
   inputDeviceId: UUID
   screenshotId?: string
 } 
