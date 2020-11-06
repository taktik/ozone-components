import { Item, OzoneType, UUID } from './Item'
import { DeviceInfo } from './DeviceInfo'
import { FlowrWarningParsable } from './FlowrWarningParsable'
import { WARNING_STATES } from './DeviceMessageWarning'

@OzoneType('flowr.location.building')
export class LocationBuilding extends Item implements FlowrWarningParsable {
	position: number = 0
	site: UUID
	warningButtonText: string
	zones: string
	devices?: DeviceInfo[]
	warningState?: WARNING_STATES = WARNING_STATES.OFF

	constructor(src: LocationBuilding) {
		super(src)
		this.position = src.position
		this.warningButtonText = src.warningButtonText
		this.site = src.site
		this.zones = src.zones
		this.warningState = src.warningState
	}
}

export class PersistedLocationBuilding extends LocationBuilding {
	id: string
	constructor(src: PersistedLocationBuilding) {
		super(src)
		this.id = src.id
	}
}

export const isLocationBuilding = (object: any): object is LocationBuilding => {
	return object.type === 'flowr.location.building'
}
