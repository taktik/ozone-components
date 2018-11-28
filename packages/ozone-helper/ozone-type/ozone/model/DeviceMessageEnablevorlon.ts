import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.enablevorlon")
export class DeviceMessageEnablevorlon extends DeviceMessage { 
   dashboard?: string
 } 
