import {Item, UUID, Instant, OzoneType} from './Item'

export interface ServiceInfo {
	instanceId: string
	properties: { [key: string]:string; } | null
	replicaId: string | null
	serviceName: string | null
}
