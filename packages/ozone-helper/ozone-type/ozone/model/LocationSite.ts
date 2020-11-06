import { Item, OzoneType } from './Item'
import { LocationBuilding } from './LocationBuilding'
import { FlowrWarningParsable } from './FlowrWarningParsable'

@OzoneType('flowr.location.site')
export class LocationSite extends Item implements FlowrWarningParsable {
	shortName: string
	buildings?: LocationBuilding[]
	constructor(src: LocationSite) {
		super(src)
		this.shortName = src.shortName
		this.buildings = src.buildings
	}
}

export class PersistedLocationSite extends LocationSite {
	id: string
	constructor(src: PersistedLocationSite) {
		super(src)
		this.id = src.id
	}
}

export const isLocationSite = (object: any): object is LocationSite => {
	return object.type === 'flowr.location.site'
}
