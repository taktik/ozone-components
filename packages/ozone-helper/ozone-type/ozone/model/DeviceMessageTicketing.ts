import { DeviceMessage } from './DeviceMessage'
import { DeviceMessageTicketingTicket } from './DeviceMessageTicketingTicket'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.message.ticketing')
export class DeviceMessageTicketing extends DeviceMessage {
	action: string | null
	location: string | null
	ticketList: DeviceMessageTicketingTicket[] | null

	constructor(src: DeviceMessageTicketing) {
		super(src)
		this.action = src.action
		this.location = src.location
		this.ticketList = src.ticketList
	}
}
