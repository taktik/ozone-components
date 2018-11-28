import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("functionTimer")
export class FunctionTimer extends Metric { 
   count?: number
   mean?: number
   totalTime?: number
 } 
