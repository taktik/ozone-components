import 'polymer/polymer.html'
import 'paper-input/paper-input.html'
import 'paper-button/paper-button.html'
import { customElement, property } from 'taktik-polymer-typescript'
import { OzoneClient } from 'ozone-typescript-client'
import UserCredentials = OzoneClient.UserCredentials
import ClientStates = OzoneClient.states
import { getDefaultClient } from 'ozone-default-client'
import once from './once'
import './ozone-login-form.html'

/**
 * ### ozone-login-form
 *
 * A generic login form for Ozone.
 * It uses 'ozone-authentication-api' to automatically authenticate to Ozone.
 *
 *
 * ### Usage
 *
 * ```javascript
 * import 'ozone-login/ozone-login-form'
 *
 * ...
 *
 * <ozone-login-form
 *       on-register-clicked="..."
 *       on-password-clicked="..."
 *       align-buttons="right|center|left"
 *       username-label="..."
 *       password-label="..."
 *       register-label="..."
 *       lost-password-label="..."
 *       submit-label="..."
 *       message-on-empty="..."
 *       message-on-invalid="..."
 *       message-on-unknown="..."
 *      >
 * </ozone-login-form>
 *
 * ```
 */
@customElement('ozone-login-form')
export class OzoneLoginForm extends Polymer.Element {

	@property({ type: String })
	public username: string = ''

	@property({ type: String })
	public password: string = ''

	@property({ type: String })
	public errorMessage: string = ''

	@property({ type: String })
	public messageOnEmpty: string = 'The username and/or password is empty'

	@property({ type: String })
	public messageOnInvalid: string = 'Invalid username and/or password'

	@property({ type: String })
	public messageOnUnknown: string = 'Unknown error. Please check your connection'

	@property({ type: String, notify: true })
	public alignButtons: string = 'center'

	@property({ type: String })
	public usernameLabel: string = 'Username'

	@property({ type: String })
	public passwordLabel: string = 'Password'

	@property({ type: String })
	public submitLabel: string = 'Login'

	@property({ type: String })
	public lostPasswordLabel: string = 'Lost password'

	@property({ type: Boolean })
	public showLostPassword: boolean = true

	@property({ type: String })
	public registerLabel: string = 'Register'

	@property({ type: Boolean })
	public showRegister: boolean = true
	/**
	 * Indicate if the user is connected.
	 * This property can be watch.
	 */
	@property({ type: Boolean, notify: true, reflectToAttribute: true })
	public isConnected: boolean = false

	public register(e: Event): void {
		this.dispatchEvent(new CustomEvent('register-clicked', {}))
	}

	public lostPassword(e: Event): void {
		this.dispatchEvent(new CustomEvent('password-clicked', { detail: { username: this.username } }))
	}
	ready(): void {
		super.ready()
		const defaultClient = getDefaultClient()
		defaultClient.onEnterState(ClientStates.STOPPED,() => {
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

	public async submitForm(e: Event): Promise<void> {
		if (this.dispatchEvent(new CustomEvent('before-submit', { detail: { form: this.$.form }, cancelable: true }))) {
			this.validateForm()
			const updateMessagesOnError = once(() => {
				this.set('isConnected', false)
				const err = defaultClient.lastFailedLogin
				if (err && err.status === 400) {
					this.set('errorMessage', this.messageOnEmpty)
				} else if (err && err.status === 403) {
					this.set('errorMessage', this.messageOnInvalid)
				} else {
					this.set('errorMessage', this.messageOnUnknown)
				}
				this.dispatchEvent(new CustomEvent('auth-error', {
					detail: {
						status: err && err.status,
						message: this.errorMessage
					}
				}))
			})

			const defaultClient = getDefaultClient()

			defaultClient.onEnterState(ClientStates.AUTHENTICATION_ERROR, updateMessagesOnError)
			const userCredentials: UserCredentials = new UserCredentials(this.username, this.password)
			defaultClient.updateCredentials(userCredentials)
			try {
				// start if needed
				await defaultClient.start()
			} catch (err) {
				// error are handle inside the client state machine
			}
		}
	}

	private validateForm(): void {
		this.$.username.validate()
		this.$.password.validate()
		if (!this.username.trim().length) return this.$.username.focus()
		if (!this.password.trim().length) this.$.password.focus()
	}

	private async onKeyPress(e: KeyboardEvent): Promise<void> {
		if (e.key === 'Enter') {
			this.validateForm()
			if (this.$.username.value.trim().length && this.$.password.value.trim().length) {
				await this.submitForm(e)
			}
		}
	}
}
