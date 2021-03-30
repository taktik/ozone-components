import { Item, OzoneType } from './Item'

@OzoneType('flowr.color')
export class FlowrColor extends Item {
	name: string = '__customColorKey'
	color: string

	constructor(src: FlowrColor) {
		super(src)
		this.name = src.name
		this.color = src.color
	}
}
