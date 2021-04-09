import { Item } from './Item'

export class Call extends Item {
	from: string
	direction?: CallDirection
	response?: CallResponse
	wakeUpDevice?: boolean

	constructor(src: Call) {
		super(src)
		this.from = src.from
		this.direction = src.direction
		this.response = src.response
		this.wakeUpDevice = src.wakeUpDevice
	}
}

export enum CallDirection {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}

export enum CallResponse {
	ACCEPTED = 'ACCEPTED',
	REFUSED = 'REFUSED',
	IGNORED = 'IGNORED', // The call will continue ringing
	TERMINATED = 'TERMINATED' // The call has been terminated before it was answered
}
