import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.messagedeleted")
export class DeviceMessageMessagedeleted extends DeviceMessage { 
   messageId: UUID
 } 
