import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('message')
export class Message extends Item {
	attachments: string | null
	body: string | null
	creationDate: number | null
	date: number | null
	externalId: number | null
	fidelioId: number | null
	from: string | null
	internalLink: string | null
	messageType: string | null
	priority: number | null
	read: number | null
	subject: string | null
	time: number | null
	toDeviceId: UUID | null
	toReservationNumber: number | null
	toRoomNumber: string | null

	constructor(src: Message) {
		super(src)
		this.attachments = src.attachments
		this.body = src.body
		this.creationDate = src.creationDate
		this.date = src.date
		this.externalId = src.externalId
		this.fidelioId = src.fidelioId
		this.from = src.from
		this.internalLink = src.internalLink
		this.messageType = src.messageType
		this.priority = src.priority
		this.read = src.read
		this.subject = src.subject
		this.time = src.time
		this.toDeviceId = src.toDeviceId
		this.toReservationNumber = src.toReservationNumber
		this.toRoomNumber = src.toRoomNumber
	}
}
