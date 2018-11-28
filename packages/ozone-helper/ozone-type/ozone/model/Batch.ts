import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("batch")
export class Batch extends Media { 
   batchItems?: [UUID]
 } 
