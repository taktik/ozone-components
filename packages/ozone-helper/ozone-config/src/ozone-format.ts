export const OzoneFormat: OzoneFormatType = {
	'type': {
		'hls': 'org.taktik.filetype.video.hls',
		'mp3': 'org.taktik.filetype.audio.mp3',
		'original': 'org.taktik.filetype.original',
		'flowr': 'org.taktik.filetype.flowr.video',
		'mp4': 'org.taktik.filetype.video.mp4',
		'jpg': 'org.taktik.filetype.image.preview.{SIZE}',
		'png': 'preview.png.{SIZE}'
	},
	'priority': {
		'video': ['hls', 'flowr', 'original', 'mp4'],
		'audio': ['hls', 'flowr', 'mp4', 'mp3', 'original']
	}
}

export type OzoneFormatType = {
	type: {
		hls: string,
		mp3: string,
		original: string,
		flowr: string,
		mp4: string,
		jpg: string,
		png: string,
		[key: string]: string
	},
	priority: {
		video: Array<string>,
		audio: Array<string>
	}
}
