import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("gauge")
export class Gauge extends Metric { 
   value?: number
 } 
