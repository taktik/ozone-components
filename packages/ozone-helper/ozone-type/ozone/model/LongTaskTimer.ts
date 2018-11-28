import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("longTaskTimer")
export class LongTaskTimer extends Metric { 
   duration?: number
 } 
