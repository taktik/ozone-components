import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('metric')
export class Metric extends TimestampedItem implements ServiceInfo {
	instanceId: string
	properties: { [key: string]:string; } | null
	replicaId: string | null
	serviceName: string | null
	tags: string[] | null

	constructor(src: Metric) {
		super(src)
		this.instanceId = src.instanceId
		this.properties = src.properties
		this.replicaId = src.replicaId
		this.serviceName = src.serviceName
		this.tags = src.tags
	}
}
