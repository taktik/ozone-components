import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.mediaplay')
export class FlowrMediaplay extends TimestampedItem implements ServiceInfo {
	description: string | null
	effectivelyPlayedDuration: number | null
	instanceId: string
	itemId: UUID | null
	playId: UUID | null
	properties: { [key: string]:string; } | null
	ratioEffectiveTotal: number | null
	replicaId: string | null
	serviceName: string | null
	totalDuration: number | null
	url: string | null
	userAgent: string | null

	constructor(src: FlowrMediaplay) {
		super(src)
		this.description = src.description
		this.effectivelyPlayedDuration = src.effectivelyPlayedDuration
		this.instanceId = src.instanceId
		this.itemId = src.itemId
		this.playId = src.playId
		this.properties = src.properties
		this.ratioEffectiveTotal = src.ratioEffectiveTotal
		this.replicaId = src.replicaId
		this.serviceName = src.serviceName
		this.totalDuration = src.totalDuration
		this.url = src.url
		this.userAgent = src.userAgent
	}
}
