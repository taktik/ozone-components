import { Call } from './Call'
import { UUID } from './Item'

export class VideoCall extends Call {
	callerId: UUID

	constructor(src: VideoCall) {
		super(src)
		this.callerId = src.callerId
	}
}

export const isVideoCall = (call: Call): call is VideoCall => call.type === 'video.call'
