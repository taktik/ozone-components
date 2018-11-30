import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('functionTimer')
export class FunctionTimer extends Metric {
	count: number | null
	mean: number | null
	totalTime: number | null

	constructor(src: FunctionTimer) {
		super(src)
		this.count = src.count
		this.mean = src.mean
		this.totalTime = src.totalTime
	}
}
