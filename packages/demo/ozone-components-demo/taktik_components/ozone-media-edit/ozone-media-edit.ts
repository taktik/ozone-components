/**
 * Created by hubert on 23/06/17.
 */

import 'polymer/polymer-element.html'
import './ozone-media-edit.html'

import { customElement, observe, property } from 'taktik-polymer-typescript'
import { Item, FieldDescriptor, Video, FromOzone } from 'ozone-type'
import { OzoneMediaUrl, OzonePreviewSize, SizeEnum } from 'ozone-media-url'
import { OzoneItemEdit } from 'ozone-item-edit'
import 'ozone-item-edit'
import { getDefaultClient } from 'ozone-default-client'
import 'ozone-video-player'
import { OzoneVideoPlayer } from 'ozone-video-player'

/**
 * <ozone-media-edit> is an element that provide material design to edit an media Item.
 *
 * ```html
 *  <link rel="import" href="../ozone-media-edit/ozone-media-edit.html">
 *      ...
 *  <ozone-media-edit item-data={{item}}>  </ozone-media-edit>
 * ```
 */
@customElement('ozone-media-edit')
export class OzoneMediaEdit extends Polymer.Element {
	/**
	 * item to display
	 */
	@property({ type: Object, notify: true })
	itemData: Item | null = null
	/**
	 * Returns true if the value is invalid.
	 */
	@property({
		type: Boolean,
		notify: true
	})
	invalid: boolean = false
	/**
	 * hide element and pause the player.
	 */
	@property({ type: Boolean, observer: 'hiddenChange' })
	hidden: boolean = false

	@property({ type: Boolean })
	isVideo: boolean = false

	playerElement?: OzoneVideoPlayer

	$: {
		itemEdit: OzoneItemEdit,
		player: OzoneVideoPlayer
	}

	@observe('itemData')
	async dataChange(data: Item) {
		if (!data) {
			return
		}
		if (!data.hasOwnProperty('type')) {
			return
		}
		this.removeEntryIfExist()
		await(this.loadImage(data, OzonePreviewSize.Medium))
		await(this.loadVideo(data))
	}

	async loadVideo(data?: Item) {
		if (data) {
			const ozoneTypeApi = await getDefaultClient().typeClient().getTypeCache()
			if (ozoneTypeApi.isTypeInstanceOf(data.type as string, 'video')) {

				this.playerElement = document.createElement('ozone-video-player') as OzoneVideoPlayer
				this.playerElement.set('subtitleSelected', 'en')
				this.$.player.appendChild(this.playerElement)
				this.playerElement.loadOzoneVideo(data as FromOzone<Video>)

				this.set('isVideo', true)
			}
		}
	}
	async loadImage(data?: Item, size?: SizeEnum) {
		size = size || OzonePreviewSize.Small
		if (data) {
			const ozoneTypeApi = await getDefaultClient().typeClient().getTypeCache()
			if (ozoneTypeApi.isTypeInstanceOf(data.type as string, 'media')) {
				const ozoneMediaUrl = new OzoneMediaUrl(data.id as string, getDefaultClient().config.ozoneURL)
				this.set('previewImage', ozoneMediaUrl.getPreviewUrlPng(size))
			} else {
				// TODO define preview
				this.set('previewImage', undefined)
			}
		}
	}

	private hiddenChange(hidden?: boolean) {
		if (typeof (hidden) === 'boolean' && hidden) {
			if (this.playerElement) {
				this.playerElement.set('hidden', true)
			}
		}
	}
	private removeEntryIfExist() {
		const entryList = this.$.player.getElementsByTagName('ozone-video-player')
		while (entryList.length > 0) {
			entryList[0].remove()
		}
	}

}
