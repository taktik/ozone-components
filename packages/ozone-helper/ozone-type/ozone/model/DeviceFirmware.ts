import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.firmware")
export class DeviceFirmware extends Item { 
   binary?: UUID
   byteSize?: number
   description?: string
   fileName?: string
   softwareVersion?: string
 } 
