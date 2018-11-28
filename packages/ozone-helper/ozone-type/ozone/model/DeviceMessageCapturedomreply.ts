import { DeviceMessageReply } from './DeviceMessageReply'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.capturedomreply")
export class DeviceMessageCapturedomreply extends DeviceMessageReply { 
   domId?: string
   doms?: [string]
   url: string
 } 
