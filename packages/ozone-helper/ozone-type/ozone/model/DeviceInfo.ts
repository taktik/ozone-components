import { FlowrFrontendSettings } from './FlowrFrontendSettings'
import { Principal } from './Principal'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.info")
export class DeviceInfo extends Item implements Principal { 
   activeMacAddress?: string
   deviceType?: string
   deviceVersion?: string
   extraInformation?: [string]
   frontendSettings?: FlowrFrontendSettings
   frontendVersion?: string
   lastLoginDate?: Instant
   lastLoginIpAddress?: string
   linkedUser?: UUID
   location?: string
   macAddress?: string
   model?: string
   network?: UUID
   principalName: string
   roles?: [UUID]
   secret?: string
   serialNumber?: string
   status?: string
   subLocation?: string
   validMacAddress?: string
 } 
