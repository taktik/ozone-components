import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("dns.record")
export class DnsRecord extends Item { 
   dns: UUID
   recordName: string
   recordType: string
   ttl: number
   value: string
 } 
