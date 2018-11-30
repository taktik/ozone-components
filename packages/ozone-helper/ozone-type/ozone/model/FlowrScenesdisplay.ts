import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.scenesdisplay')
export class FlowrScenesdisplay extends TimestampedItem implements ServiceInfo {
	description: string | null
	displayId: UUID | null
	duration: number | null
	instanceId: string
	itemId: UUID | null
	properties: { [key: string]:string; } | null
	replicaId: string | null
	serviceName: string | null
	userAgent: string | null

	constructor(src: FlowrScenesdisplay) {
		super(src)
		this.description = src.description
		this.displayId = src.displayId
		this.duration = src.duration
		this.instanceId = src.instanceId
		this.itemId = src.itemId
		this.properties = src.properties
		this.replicaId = src.replicaId
		this.serviceName = src.serviceName
		this.userAgent = src.userAgent
	}
}
