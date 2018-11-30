import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('passingtime')
export class Passingtime extends Item {
	expectedArrivalTime: Instant | null
	lineId: number | null
	pointId: number | null

	constructor(src: Passingtime) {
		super(src)
		this.expectedArrivalTime = src.expectedArrivalTime
		this.lineId = src.lineId
		this.pointId = src.pointId
	}
}
