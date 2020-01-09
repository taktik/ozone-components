import 'polymer/polymer.html'
import { customElement, property } from 'taktik-polymer-typescript'
import { OzoneClient } from 'ozone-typescript-client'
import ClientStates = OzoneClient.states
import { getDefaultClient } from 'ozone-default-client'
import './ozone-logout-form.html'

/**
 * ### ozone-logout-form
 *
 * A generic logout form for Ozone.
 *
 */
@customElement('ozone-logout-form')
export class OzoneLogoutForm extends Polymer.Element {
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
			console.log('STOPPED')
			this.set('isConnected', false)
		})
		defaultClient.onEnterState(ClientStates.AUTHENTICATED,() => {
			this.set('isConnected', true)
		})
		if (defaultClient.authInfo) {
			// client is already logged
			this.set('isConnected', true)
		}
	}

	public async logout(e: Event): Promise<void> {
		const defaultClient = getDefaultClient()
		await defaultClient.stop()
	}
}
