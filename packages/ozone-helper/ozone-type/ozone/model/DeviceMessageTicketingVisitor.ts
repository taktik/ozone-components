import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.ticketing.visitor")
export class DeviceMessageTicketingVisitor extends DeviceMessage { 
   firstName: string
   lastName: string
 } 
