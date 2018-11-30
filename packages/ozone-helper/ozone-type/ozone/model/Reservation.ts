import { Item, UUID, Instant, OzoneType } from './Item'

@OzoneType('reservation')
export class Reservation extends Item {
	a0?: string
	a1?: string
	a2?: string
	a3?: string
	a4?: string
	a5?: string
	a6?: string
	a7?: string
	a8?: string
	a9?: string
	checkOut?: number
	classOfService?: string
	date?: number
	guestArrivalDate?: number
	guestDepartureDate?: number
	guestFirstName?: string
	guestGroupNumber?: string
	guestLanguage?: string
	guestName?: string
	guestTitle?: string
	guestVipStatus?: string
	lastMutationDate?: number
	minibarRights?: string
	noPostStatus?: string
	oldRoomNumber?: string
	profileNumber?: string
	reservationNumber?: number
	roomNumber?: string
	shareFlag?: string
	swapFlag?: string
	time?: number
	tvRights?: string
	videoRights?: string
	visitNumber?: string
	workstationId?: string

	constructor(src: Reservation) {
		super(src)
		this.a0 = src.a0
		this.a1 = src.a1
		this.a2 = src.a2
		this.a3 = src.a3
		this.a4 = src.a4
		this.a5 = src.a5
		this.a6 = src.a6
		this.a7 = src.a7
		this.a8 = src.a8
		this.a9 = src.a9
		this.checkOut = src.checkOut
		this.classOfService = src.classOfService
		this.date = src.date
		this.guestArrivalDate = src.guestArrivalDate
		this.guestDepartureDate = src.guestDepartureDate
		this.guestFirstName = src.guestFirstName
		this.guestGroupNumber = src.guestGroupNumber
		this.guestLanguage = src.guestLanguage
		this.guestName = src.guestName
		this.guestTitle = src.guestTitle
		this.guestVipStatus = src.guestVipStatus
		this.lastMutationDate = src.lastMutationDate
		this.minibarRights = src.minibarRights
		this.noPostStatus = src.noPostStatus
		this.oldRoomNumber = src.oldRoomNumber
		this.profileNumber = src.profileNumber
		this.reservationNumber = src.reservationNumber
		this.roomNumber = src.roomNumber
		this.shareFlag = src.shareFlag
		this.swapFlag = src.swapFlag
		this.time = src.time
		this.tvRights = src.tvRights
		this.videoRights = src.videoRights
		this.visitNumber = src.visitNumber
		this.workstationId = src.workstationId
	}
}
