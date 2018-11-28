import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.email")
export class DeviceMessageEmail extends DeviceMessage { 
   from: string
   message: string
   subject: string
 } 
