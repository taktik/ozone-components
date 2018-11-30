import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('vehicleposition')
export class Vehicleposition extends Item {
	directionId: number | null
	distanceFromPoint: number | null
	lineId: number | null
	pointId: number | null

	constructor(src: Vehicleposition) {
		super(src)
		this.directionId = src.directionId
		this.distanceFromPoint = src.distanceFromPoint
		this.lineId = src.lineId
		this.pointId = src.pointId
	}
}
