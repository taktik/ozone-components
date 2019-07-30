/*!
 *
 *  ClapprSubtitle
 *  Copyright 2016 JMV Technology. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use (this as any) file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 */
import * as Clappr from 'Clappr'
import { debug } from 'util'
import { OzoneMediaUrl } from 'ozone-media-url'
import { getDefaultClient } from 'ozone-default-client'

let BLOCK_REGEX = /[0-9]+(?:\r\n|\r|\n)([0-9]{2}:[0-9]{2}:[0-9]{2}(?:,|\.)[0-9]{3}) --> ([0-9]{2}:[0-9]{2}:[0-9]{2}(?:,|\.)[0-9]{3})(?:\r\n|\r|\n)((?:.*(?:\r\n|\r|\n))*?)(?:\r\n|\r|\n)/g

export class ClapprSubtitle extends Clappr.UICorePlugin {

	subtitles = []

	element = null

	_active = false

	get name() { return 'subtitle-plugin' }

	/**
	 * @constructor
	 */
	constructor(core: any) {
		super(core)

		this.subtitles = [];

		// initialize subtitle on DOM
		(this as any).initializeElement()

		// check options
		if (! (this as any)._options.subtitle) {
			return
		}

		let options = (this as any)._options.subtitle

		// override src and style
		// if 'options' is object
		if (typeof(options) === 'object') {
			if ('src' in options) {
				if (typeof(options.src) === 'string') {
					(this as any).options.src = options.src
				} else {
					return
				}
			}

			if ('auto' in options) {
				(this as any).options.auto = options.auto === true
				if ((this as any).options.auto) {
					// this.active = true;
				}
			}

			if ('backgroundColor' in options) {
				(this as any).options.backgroundColor = options.backgroundColor
			}

			if ('color' in options) {
				(this as any).options.color = options.color
			}

			if ('fontSize' in options) {
				(this as any).options.fontSize = options.fontSize
			}

			if ('fontWeight' in options) {
				(this as any).options.fontWeight = options.fontWeight
			}

			if ('textShadow' in options) {
				(this as any).options.textShadow = options.textShadow
			}

			// override src if 'options' is string
		} else if (typeof(options) === 'string') {
			(this as any).options.src = options;
			(this as any).options.auto = true
		} else {
			return
		}
		// initialize subtitle on DOM
		(this as any).initializeElement()
		this.initSubtitle()

	}

	initSubtitle() {
		this.addMenuToMediaControl()
		// fetch subtitles
		this.fetchSubtitle((this as any).onSubtitlesFetched.bind((this as any)))
	}

	isThereSubtitle(): boolean {
		if ((this as any).options.subtitle && (this as any).options.subtitle.list) {
			return ((this as any).options.subtitle.list as Map<string, string>).size > 0
		} else {
			return false
		}

	}
	_menuOpen: boolean = false
	get active(): boolean {
		return this._active
	}
	set active(active: boolean) {
		let menuContainer = (this as any).core
			.mediaControl
			.$el
			.children('.media-control-layer')
			.children('.media-control-right-panel')
			.children('.media-control-subtitle-toggler')

		menuContainer[0].style.opacity = active ? '1' : 0.5
		if (!active) this.hideElement()
		this._active = active
	}

	/**
	 * Add event listeners
	 */
	bindEvents() {
		(this as any).listenTo((this as any).core, Clappr.Events.CORE_CONTAINERS_CREATED, (this as any).containersCreated);
		(this as any).listenTo((this as any).core.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, (this as any).addButtonToMediaControl);
		(this as any).listenTo((this as any).core.mediaControl, Clappr.Events.MEDIACONTROL_SHOW, (this as any).onMediaControlShow);
		(this as any).listenTo((this as any).core.mediaControl, Clappr.Events.MEDIACONTROL_HIDE, (this as any).onMediaControlHide);
		(this as any).listenTo((this as any).core.mediaControl, Clappr.Events.MEDIACONTROL_CONTAINERCHANGED, (this as any).onContainerChanged);
		(this as any).listenTo((this as any).core.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, () => { this.initSubtitle() })
	}

	/**
	 * Add event listeners after containers were created
	 */
	containersCreated() {
		// append element to container
		(this as any).core.containers[0].$el.append((this as any).element);
		// run
		(this as any).listenTo((this as any).core.containers[0].playback, Clappr.Events.PLAYBACK_TIMEUPDATE, (this as any).run)
	}

	/**
	 * On container changed
	 */
	onContainerChanged() {
		// container changed is fired right off the bat
		// so we should bail if subtitles aren't yet loaded
		if ((this as any).subtitles.length === 0) {
			return
		}

		// kill the current element
		(this as any).element.parentNode.removeChild((this as any).element);

		// clear subtitles
		(this as any).subtitle = [];

		// initialize stuff again
		(this as any).initialize();

		// trigger containers created
		(this as any).containersCreated()
	}

	/**
	 * Subtitles fetched
	 */
	onSubtitlesFetched(data: any) {
		// parse subtitle
		(this as any).parseSubtitle(data)
	}

	/**
	 * AJAX request to the subtitles source
	 * @param {function} callback
	 */
	fetchSubtitle(cb: any) {

		if (typeof((this as any).options.src) === 'string') {
			let r = new XMLHttpRequest()
			r.open('GET', (this as any).options.src, true)
			r.onreadystatechange = function() {
				// nothing happens if request
				// fails or is not ready
				if (r.readyState !== 4 || r.status !== 200) {
					return
				}

				// callback
				if (cb) {
					cb(r.responseText)
				}
			}
			r.send()
		}
	}

	/**
	 * Parse subtitle
	 * @param {string} data
	 */
	parseSubtitle(datas: any) {

		// clear existing subtitles if any
		this.subtitles = []

		// Get blocks and loop through them
		let blocks: Array<any> = datas.match(BLOCK_REGEX)

		for (let i = 0; i < blocks.length; i++) {

			let startTime = null
			let endTime = null
			let text = ''

			// Break the block in lines
			let block = blocks[i]
			let lines = block.split(/(?:\r\n|\r|\n)/)

			// The second line is the time line.
			// We parse the start and end time.
			let time = lines[1].split(' --> ')
			startTime = (this as any).humanDurationToSeconds(time[0].trim())
			endTime = (this as any).humanDurationToSeconds(time[1].trim())

			// As for the rest of the lines, we loop through
			// them and append the to the text,
			for (let j = 2; j < lines.length; j++) {
				let line = lines[j].trim()

				if (text.length > 0) {
					text += '<br />'
				}

				text += line
			}

			// Then we push it to the subtitles
			(this as any).subtitles.push({
				startTime: startTime,
				endTime: endTime,
				text: text
			})
		}
	}

	/**
	 * Converts human duration time (00:00:00) to seconds
	 * @param {string} human time
	 * @return {float}
	 */
	humanDurationToSeconds(duration: any) {
		duration = duration.split(':')

		// tslint:disable-next-line:one-variable-per-declaration
		let hours = duration[0],
			minutes = duration[1],
			seconds = duration[2].replace(',', '.')

		let result = 0.00
		result += parseFloat(hours) * 60 * 60
		result += parseFloat(minutes) * 60
		result += parseFloat(seconds)

		return result
	}

	/**
	 * Initializes the subtitle on the dom
	 */
	initializeElement() {
		let el = document.createElement('div')
		el.classList.add('subtitles');
		(this as any).element = el
	}

	/**
	 * Add button to media control
	 */
	addButtonToMediaControl() {
		if (this.isThereSubtitle()) {
			let bar = (this as any).core
				.mediaControl
				.$el
				.children('.media-control-layer')
				.children('.media-control-right-panel')

			// create icon
			let button = document.createElement('button')
			button.classList.add('media-control-button')
			button.classList.add('media-control-icon')
			button.classList.add('media-control-subtitle-toggler')
			button.innerHTML = (this as any).getMediaControlButtonSVG()

			// create icon
			let menuContainer = document.createElement('div')
			menuContainer.classList.add('media-control-menu')

			// if active, glow
			if (this.active) {
				button.style.opacity = '1'
			}

			// append to bar
			bar.append(button)

			// add listener
			button.onclick = (e) => this.onMediaControlButtonClick(e)
		}

	}

	/**
	 * Button SGV
	 * @return {string}
	 */
	getMediaControlButtonSVG() {
		return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" style="pointer-events: none">' +
			'<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>' +
			'<g><path d="M893.4,599V500H401.1V599H893.4z M893.4,794.5v-98.9H695.5v98.9H893.4z M598.9,794.5v-98.9H106.6v98.9H598.9z M106.6,500V599h197.8V500H106.6z M893.4,106.7c26.1,0,48.7,10,67.9,29.9s28.8,42.9,28.8,69v588.9c0,26.1-9.6,49.1-28.8,69c-19.2,19.9-41.8,29.9-67.9,29.9H106.6c-26.1,0-48.7-10-67.9-29.9c-19.2-19.9-28.8-42.9-28.8-69V205.5c0-26.1,9.6-49.1,28.8-69s41.8-29.9,67.9-29.9H893.4z"/></g>' +
			'</svg>'
	}

	/**
	 * on button click
	 */
	onMediaControlButtonClick(mouseEvent: any) {
		console.log('onMediaControlButtonClick')

		// toggle menuOpen on/off
		this.menuOpen = ! this.menuOpen
	}

	set menuOpen(val: boolean) {
		let subtitlesMenu = (this as any).core
			.mediaControl
			.$el
			.children('.media-control-layer')
			.children('.media-control-right-panel')
			.children('.media-control-subtitles-menu')
		this._menuOpen = val

		subtitlesMenu.css('opacity', val ? '1' : '0')
	}
	get menuOpen() {
		return this._menuOpen
	}

	async getSubtile(id: string) {
		const mediaUrl = new OzoneMediaUrl(id, getDefaultClient().config.ozoneURL);
		(this as any).options.src = mediaUrl.getOriginalFormat()
		this.fetchSubtitle((this as any).onSubtitlesFetched.bind((this as any)))
	}

	/**
	 * Add subtitles menu to media control
	 */
	addMenuToMediaControl() {
		let bar = (this as any).core
			.mediaControl
			.$el
			.children('.media-control-layer')
			.children('.media-control-right-panel')

		// create icon
		let menuContainer = document.createElement('div')
		menuContainer.classList.add('media-control-subtitles-menu')
		if ((this as any).options.subtitle.list) {
			(this as any).options.subtitle.list.forEach((id: string, name: string) => {
				let subtitleElement = document.createElement('div')
				subtitleElement.classList.add('media-control-subtitles-menu-element')
				subtitleElement.classList.add(name)
				subtitleElement.textContent = name
				console.log('add ', name)
				menuContainer.appendChild(subtitleElement)
				subtitleElement.onclick = (mouseEvent: any) => {
					this.selectSubtitleTrack(name, id)
					menuContainer.style.opacity = '0'
					this.menuOpen = false
				}
			})
		}
		// append to bar
		if (menuContainer.hasChildNodes()) {
			bar.append(menuContainer)
		}

	}

	selectSubtitleTrack(name: string, id: string) {
		this.getSubtile(id)
		const subtitleList = (this as any).core
			.mediaControl
			.$el
			.children('.media-control-layer')
			.children('.media-control-right-panel')
			.children('.media-control-subtitles-menu')
			.children('.media-control-subtitles-menu-element') as Array<Element>

		if (subtitleList) {
			subtitleList.forEach((menuElement) => {
				if (menuElement.classList.contains(name)) {
					this.active = menuElement.classList.toggle('selected')

				} else {
					menuElement.classList.remove('selected')
				}
			})
		}

	}

	/**
	 * Hides the subtitle element
	 */
	hideElement() {
		(this as any).element.style.opacity = '0'
	}

	/**
	 * Shows the subtitle element with text
	 * @param {string} text
	 */
	showElement(text: any) {
		if (!this.active) {
			return
		}
		(this as any).element.innerHTML = text;
		(this as any).element.style.opacity = '1'
	}

	/**
	 * Subtitle element moves up
	 * to give space to the controls
	 */
	onMediaControlShow() {
		if ((this as any).element) {
			(this as any).element.style.bottom = '100px'
		}
	}

	/**
	 * Subtitle element moves down
	 * when controls hide
	 */
	onMediaControlHide() {
		if ((this as any).element) {
			(this as any).element.style.bottom = '50px'
		}
	}

	/**
	 * Show subtitles as media is playing
	 */
	run(time: any) {
		let subtitle = (this as any).subtitles.find(function(subtitle: any) {
			return time.current >= subtitle.startTime && time.current <= subtitle.endTime
		})

		if (subtitle) {
			(this as any).showElement(subtitle.text)
		} else {
			(this as any).hideElement()
		}
	}

}

//  export const ClapprSubtitle = Clappr.CorePlugin.extend(ClapprSubtitleObject);
