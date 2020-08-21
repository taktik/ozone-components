import {Item, OzoneType, UUID} from "./Item";

@OzoneType('flowr.location.building')
export default class LocationBuilding extends Item {
	position: number = 0
	site: UUID
	warningButtonText: string
	zones: string

	constructor(src: LocationBuilding) {
		super(src)
		this.position = src.position
		this.warningButtonText = src.warningButtonText;
		this.site = src.site
		this.zones = src.zones;
	}
}
