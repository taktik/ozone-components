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
declare class OzoneLogin extends Polymer.Element {
    /**
     * Indicate if the user is connected.
     * This property can be watch.
     */
    isConnected: boolean;
    /**
     * Username to use for login.
     */
    username: string;
    /**
     * Password to use for login.
     */
    password: string;
    /**
     * Error message display to explain why the connection fail.
     *
     */
    displayedMessage: string;
    /**
     * Connect to Ozone
     */
    ozoneConnect(): void;
}
