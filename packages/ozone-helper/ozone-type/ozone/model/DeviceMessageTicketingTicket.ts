import { DeviceMessage } from './DeviceMessage'
import { DeviceMessageTicketingVisitor } from './DeviceMessageTicketingVisitor'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.ticketing.ticket")
export class DeviceMessageTicketingTicket extends DeviceMessage { 
   status: string
   ticketId: string
   visitor?: DeviceMessageTicketingVisitor
 } 
