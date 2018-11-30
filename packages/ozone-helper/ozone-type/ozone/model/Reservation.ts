import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('reservation')
export class Reservation extends Item {
	a0: string | null
	a1: string | null
	a2: string | null
	a3: string | null
	a4: string | null
	a5: string | null
	a6: string | null
	a7: string | null
	a8: string | null
	a9: string | null
	checkOut: number | null
	classOfService: string | null
	date: number | null
	guestArrivalDate: number | null
	guestDepartureDate: number | null
	guestFirstName: string | null
	guestGroupNumber: string | null
	guestLanguage: string | null
	guestName: string | null
	guestTitle: string | null
	guestVipStatus: string | null
	lastMutationDate: number | null
	minibarRights: string | null
	noPostStatus: string | null
	oldRoomNumber: string | null
	profileNumber: string | null
	reservationNumber: number | null
	roomNumber: string | null
	shareFlag: string | null
	swapFlag: string | null
	time: number | null
	tvRights: string | null
	videoRights: string | null
	visitNumber: string | null
	workstationId: string | null

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
