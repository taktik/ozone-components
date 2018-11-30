import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('functionCounter')
export class FunctionCounter extends Metric {
	count: number | null

	constructor(src: FunctionCounter) {
		super(src)
		this.count = src.count
	}
}
