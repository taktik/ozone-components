import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("timer")
export class Timer extends Metric { 
   count?: number
   max?: number
   mean?: number
   totalTime?: number
 } 
