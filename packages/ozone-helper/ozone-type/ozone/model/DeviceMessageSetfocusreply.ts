import { DeviceMessageReply } from './DeviceMessageReply'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.setfocusreply")
export class DeviceMessageSetfocusreply extends DeviceMessageReply { 
   focusId?: string
   result: boolean
 } 
