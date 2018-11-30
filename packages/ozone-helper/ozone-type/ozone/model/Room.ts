import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('room')
export class Room extends Item {
	roomNumber: string | null
	wakeUps: string[] | null

	constructor(src: Room) {
		super(src)
		this.roomNumber = src.roomNumber
		this.wakeUps = src.wakeUps
	}
}
