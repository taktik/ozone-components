import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.keypress")
export class DeviceMessageKeypress extends DeviceMessage { 
   eventName: string
   key?: string
 } 
