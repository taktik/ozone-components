import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("distributionSummary")
export class DistributionSummary extends Metric { 
   count?: number
   max?: number
   mean?: number
   totalAmount?: number
 } 
