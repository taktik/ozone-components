import { Item } from './Item'

export class Call extends Item {
	from: string

	constructor(src: Call) {
		super(src)
		this.from = src.from
	}
}
