/**
 * `ozone-login` is a login facility for Ozone.
 *
 *                                           Example:
 *
 * ```html
 * <style is="custom-style">
 *   .customStyle {
 *     --ozone-api-login-signin-input: {
 *       background-color: green;
 *       color: white;
 *     };
 *     --ozone-api-login-input-color: {
 *       --paper-input-container-focus-color: red;
 *     }
 *   }
 * </style>
 * <ozone-login class="customStyle"></ozone-login>
 *
 * ```
 *
 * ### Events
 *
 * If you need to capture ozone api events *ozone-api-request-success* and *ozone-api-request-success*.
 * You can add events listeners on:
 *     - $.login: OzoneApiLogin
 *
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 *     `--ozone-api-login-error-theme`   | css mixin for connection error message in paper-button| `{color: red;}`
 *     `--ozone-api-login-username-input`   | css mixin for username paper-input element | `{}`
 *     `--ozone-api-login-password-input`   | css mixin for password paper-input element | `{}`
 *     `--ozone-api-login-signin-input`   | css mixin for sing in paper-button | `{}`
 *     `--ozone-api-login-input-color` | css mixin for inputs colors | '{--paper-input-container-focus-color: #2C2958;}'`
 * `--ozone-api-login-title` | css mixin for login title style | '{}'`
 *     `--ozone-api-forgot-password-button` | css mixin for forgot password button style | '{}'`
 * `--ozone-api-create-account-button` | css mixin for create account button style | '{}'`
 **/
import { getDefaultClient } from 'ozone-default-client'
import { OzoneClient } from 'ozone-typescript-client'

import './ozone-login.html'
import UserCredentials = OzoneClient.UserCredentials

class OzoneLogin extends Polymer.Element {
	static get is() {
		return 'ozone-login'
	}
	username?: string
	password?: string

	static get properties() {
		return {
			/**
			 * Indicate if the user is connected.
			 * This property can be watch.
			 */
			isConnected: {
				type: Boolean,
				value: false,
				notify: true
			},
			/**
			 * Username to use for login.
			 */
			username: {
				type: String,
				value: undefined,
				notify: true
			},
			/**
			 * Password to use for login.
			 */
			password: {
				type: String,
				value: undefined,
				notify: false
			},
			/**
			 * Error message display to explain why the connection fail.
			 *
			 */
			displayedMessage: {
				type: String,
				value: undefined,
				notify: true
			}

		}
	}

	ready() {
		super.ready()

		getDefaultClient()
			.onEnterState(OzoneClient.states.AUTHENTICATION_ERROR, () => {
				this.set('displayedMessage', 'Connection error')
				this.set('isConnected', false)
				this.dispatchEvent(new CustomEvent('ozone-logout', {
					bubbles: true, composed: true
				} as any))
			})

		getDefaultClient()
			.onEnterState(OzoneClient.states.AUTHENTICATED, () => {
				this.set('displayedMessage', null)
				this.set('isConnected', true)
				this.dispatchEvent(new CustomEvent('ozone-login', {
					bubbles: true, composed: true
				} as any))
			})
		getDefaultClient().start()

		if (! getDefaultClient().isConnected) {
			this.set('isConnected', false)
			this.dispatchEvent(new CustomEvent('ozone-logout', {
				bubbles: true, composed: true
			} as any))
		}
		this.$.username.addEventListener('keydown', (keypress: any) => {
			if (keypress.key === 'Enter' || keypress.keyCode === 13) {
				this.$.password.focus()
			}
		})
		this.$.password.addEventListener('keydown', (keypress: any) => {
			if (keypress.key === 'Enter' || keypress.keyCode === 13) {
				this.$.signInBtn.dispatchEvent(new CustomEvent('tap', {
					bubbles: true, composed: true
				} as any))
			}
		})
	}

	/**
	 * Connect to Ozone
	 */
	ozoneConnect() {
		if (this.username && this.password) {
			getDefaultClient().updateCredentials(new UserCredentials(this.username, this.password))
		}
	}
}
window.customElements.define(OzoneLogin.is, OzoneLogin)
