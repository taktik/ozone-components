import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.forcechannel")
export class DeviceMessageForcechannel extends DeviceMessage { 
   itemId?: string
   lang?: string
   route: string
   sceneId?: string
   volume?: number
 } 
