import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("reservation")
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
 } 
