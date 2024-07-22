import * as Clappr from 'Clappr'

export class  WCMediaControl extends Clappr.MediaControl {

	get events() {
		return {
			'click [data-play]': 'play',
			'click [data-pause]': 'pause',
			'click [data-playpause]': 'togglePlayPause',
			'click [data-stop]': 'stop',
			'click [data-playstop]': 'togglePlayStop',
			'click [data-fullscreen]': 'toggleFullscreen',
			'click .bar-container[data-volume]': 'onVolumeClick',
			'click .drawer-icon[data-volume]': 'toggleMute',
			'mouseenter .drawer-container[data-volume]': 'showVolumeBar',
			'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
			'mousedown .bar-container[data-volume]': 'startVolumeDrag',
			'mousemove .bar-container[data-volume]': 'mousemoveOnVolumeBar',
			'mousedown .bar-container[data-seekbar]': 'startSeekDrag',
			'mouseenter .media-control-layer[data-controls]': 'setUserKeepVisible',
			'mouseleave .media-control-layer[data-controls]': 'resetUserKeepVisible'
		}
	}

		/***  Start seek control  ***/
	seek(event: MouseEvent) {
		event.stopPropagation()
		const target = event.target as Element

		if (target.classList.contains('bar-scrubber')
			|| target.classList.contains('bar-scrubber-icon')) {

		} else {
			if (!this.settings.seekEnabled) return
			const offsetX = event.offsetX
			let pos = offsetX / this.$seekBarContainer[0].clientWidth * 100
			pos = Math.min(100, Math.max(pos, 0))
			this.setPosition(pos)
		}
		return false
	}

	mousemoveOnSeekBar(event: MouseEvent) {}
	mouseleaveOnSeekBar(event: MouseEvent) {}
	stopDragHandler() {}
	updateDragHandler() {}

	startSeekDrag(event: MouseEvent) {
		super.startSeekDrag(event)

		const parentElement = this.$seekBarContainer[0] as HTMLElement
		window.addEventListener('mousemove', updateSeek, false)
		window.addEventListener('mouseup', stopDragSeek, false)
		const self = this
		this.seek(event)

		function updateSeek(e: MouseEvent) {
			if (self.userKeepVisible) {
				const target = event.target as Element
				e.preventDefault()
				e.stopPropagation()

				const movePc = (e.movementX / parentElement.clientWidth) * 100
				const posPc = parseFloat(self.$seekBarScrubber[0].style.left)
				let pos = posPc + movePc
				self.setPosition(pos)
			}
		}

		function stopDragSeek(e: MouseEvent) {
			e.preventDefault()
			e.stopPropagation()
			self.$el.removeClass('dragging')
			self.$seekBarLoaded.removeClass('media-control-notransition')
			self.$seekBarPosition.removeClass('media-control-notransition')
			self.$seekBarScrubber.removeClass('media-control-notransition dragging')
			self.draggingSeekBar = false
			self.draggingVolumeBar = false
			window.removeEventListener('mousemove', updateSeek, false)
			window.removeEventListener('mouseup', stopDragSeek, false)
		}
	}

	setPosition(pos: number) {

		pos = Math.min(99, Math.max(pos, 0))
		this.container.seekPercentage(pos)
		this.setSeekPercentage(pos)
	}

	setTime(timeSec: number) {
		let pos = (timeSec / this.container.getDuration()) * 100
		this.setPosition(pos)
	}

	/***  Start seek control  ***/

	show(event: MouseEvent) {
		if (this.disabled) {
			return
		}
		const timeout = 2000
		if (!event ||
			(event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY)
			|| navigator.userAgent.match(/firefox/i)) {
			clearTimeout(this.hideId)
			this.$el.show()
			this.trigger(Clappr.Events.MEDIACONTROL_SHOW, this.name)
			this.$el.removeClass('media-control-hide')
			this.hideId = window.setTimeout(() => this.hide(), timeout)
			if (event) {
				this.lastMouseX = event.clientX
				this.lastMouseY = event.clientY
			}
		}
	}

	stopDrag(event: MouseEvent) {
		// super.stopDrag(event)
	}

	hide(delay = 0) {
		if (!this.isVisible()) {
			return
		}
		const timeout = delay || 2000
		clearTimeout(this.hideId)
		if (!this.disabled && this.options.hideMediaControl === false) {
			return
		}
		if (!this.container.isPlaying()) {
			return
		}
		if (!this.disabled && (delay || this.userKeepVisible || this.keepVisible || this.draggingSeekBar || this.draggingVolumeBar)) {
			this.hideId = window.setTimeout(() => this.hide(), timeout)
		} else {
			this.trigger(Clappr.Events.MEDIACONTROL_HIDE, this.name)
			this.$el.addClass('media-control-hide')
			this.hideVolumeBar(0)
		}
	}

	/***  Start audio control  ***/
	updateDrag(event: MouseEvent) {
	}
	getVolumeFromUIEvent(event: MouseEvent) {
		const volumeBar = this.$volumeBarContainer.children('.segmented-bar-element')
		return (volumeBar.indexOf(event.target) + 1) * volumeBar.size()
	}
	_savedVolume: number | undefined
	get savedVolume() {
		if (!this._savedVolume) {
			this._savedVolume = this.container.volume as number
		}
		return this._savedVolume
	}
	set savedVolume(savedVolume: number) {
		this._savedVolume = savedVolume
	}
	toggleMute() {
		this.setVolume(this.muted ? 0 : this.savedVolume)
	}
	onVolumeClick(event: MouseEvent) {
		this.savedVolume = this.getVolumeFromUIEvent(event)
		this.setVolume(this.savedVolume)
	}

	mousemoveOnVolumeBar(event: MouseEvent) {}
	startVolumeDrag(event: MouseEvent) {

		window.addEventListener('mousemove', updateVolume, false)
		window.addEventListener('mouseup', stopDragVolume, false)
		const self = this
		this.onVolumeClick(event)

		function updateVolume(e: MouseEvent) {
			const parentElement = self.$volumeBarContainer[0] as HTMLElement
			const movePc = (e.movementX / parentElement.clientWidth) * 100
			self.savedVolume = self.savedVolume + movePc
			self.setVolume(self.savedVolume)
		}

		function stopDragVolume(e: Event) {
			window.removeEventListener('mousemove', updateVolume, false)
			window.removeEventListener('mouseup', stopDragVolume, false)
		}
	}

	/***  End audio control  ***/

}
