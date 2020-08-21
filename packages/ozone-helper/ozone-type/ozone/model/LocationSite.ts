import {Item, OzoneType} from "./Item";

@OzoneType('flowr.location.site')
export default class LocationSite extends Item {
	shortName: string

	constructor(src: LocationSite) {
		super(src)
		this.shortName = src.shortName
	}
}
