import { Metric } from './Metric'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('timer')
export class Timer extends Metric {
	count: number | null
	max: number | null
	mean: number | null
	totalTime: number | null

	constructor(src: Timer) {
		super(src)
		this.count = src.count
		this.max = src.max
		this.mean = src.mean
		this.totalTime = src.totalTime
	}
}
