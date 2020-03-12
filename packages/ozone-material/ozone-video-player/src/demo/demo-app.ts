import 'polymer/polymer-element.html'
import './demo-app.html'
import { customElement, property } from 'taktik-polymer-typescript'
import { OzoneVideoPlayer } from '../ozone-video-player'
import { MarkerOnVideo } from '../clappr-marker'
import { Video, FromOzone } from 'ozone-type'

@customElement('demo-app')
class DemoApp extends Polymer.Element {

	$: {
		mediaPlayer: OzoneVideoPlayer,
		addMarker: Element,
		clear: Element,
		loadUrl: Element,
		loadOzoneSub: Element
	} | undefined

	@property()
	videoUrl: string = 'test/data/3/org.taktik.filetype.video.hls/index.m3u8'

	@property()
	display: boolean = false

	@property()
	subtitleSelect?: string

	@property()
	markers?: Array<MarkerOnVideo>

	@property()
	subtitles?: Array<string>

	ready() {
		super.ready()
		if (!this.$) {
			throw new Error()
		}
		this.$.addMarker.addEventListener('click', e => this._addMarker())
		this.$.clear.addEventListener('click', e => this._clearMarkers())
		this.$.loadUrl.addEventListener('click', e => this._loadUrl())
		this.$.loadOzoneSub.addEventListener('click', e => this._loadOzoneVideo())
	}

	_addMarker() {
		if (!this.$) {
			throw new Error()
		}
		this.$.mediaPlayer.addMarker({ duration:  10, time: 10 })
	}
	_clearMarkers() {
		if (!this.$) {
			throw new Error()
		}
		this.$.mediaPlayer.clearMarkers()
	}
	_loadUrl() {
		if (!this.$) {
			throw new Error()
		}
		this.$.mediaPlayer.loadVideoUrl(this.videoUrl)
	}
	_loadOzoneVideo() {
		if (!this.$) {
			throw new Error()
		}
		const video: any = new Video({
			id: '00000000-0000-0000-0000-000000000003',
			subTitle: { 'English': '00000000-0000-0000-0000-000000000002','Polish': '00000000-0000-0000-0000-000000000001' }
		})
		this.$.mediaPlayer.loadOzoneVideo(video)
	}

}
