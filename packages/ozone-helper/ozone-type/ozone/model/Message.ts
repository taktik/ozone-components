import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("message")
export class Message extends Item { 
   attachments?: string
   body?: string
   creationDate?: number
   date?: number
   externalId?: number
   fidelioId?: number
   from?: string
   internalLink?: string
   messageType?: string
   priority?: number
   read?: number
   subject?: string
   time?: number
   toDeviceId?: UUID
   toReservationNumber?: number
   toRoomNumber?: string
 } 
