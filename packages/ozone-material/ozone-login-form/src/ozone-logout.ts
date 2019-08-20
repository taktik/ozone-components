import 'polymer/polymer.html'

import { customElement, property } from 'taktik-polymer-typescript'
import { OzoneClient } from 'ozone-typescript-client'
import ClientStates = OzoneClient.states
import { getDefaultClient } from 'ozone-default-client'
import './ozone-logout.html'
/**
 * ### ozone-logout
 *
 * A generic logout form for Ozone.
 *
 */
@customElement('ozone-logout')
export class OzoneLogout extends Polymer.Element {
	/**
	 * Indicate if the user is connected.
	 * This property can be watch.
	 */
	@property({ type: Boolean, notify: true, reflectToAttribute: true })
	public isConnected: boolean = false

	ready(): void {
		super.ready()
		const defaultClient = getDefaultClient()
		defaultClient.onEnterState(ClientStates.STOPPED,() => {
			this.set('isConnected', false)
		})
		defaultClient.onEnterState(ClientStates.AUTHENTICATED,() => {
			this.set('isConnected', true)
		})
		this.$.logout.addEventListener('mousedown', this.logout.bind(this))
	}

	public async logout(e: Event): Promise<void> {
		const defaultClient = getDefaultClient()
		await defaultClient.stop()
	}
}
