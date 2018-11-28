import { Recording } from './Recording'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowrecording")
export class Flowrecording extends Recording { 
   description?: string
   deviceId: UUID
   summary?: string
   thumbnail?: string
 } 
