import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("license")
export class License extends Item { 
   license: string
   licenseId?: UUID
 } 
