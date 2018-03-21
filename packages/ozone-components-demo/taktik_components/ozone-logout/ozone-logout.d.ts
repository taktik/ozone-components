/**
* `ozone-logout` is a login/out facility for Ozone.
*
*                                                Example:
*
* ```html
* <style is="custom-style">
*   .customStyle {
*     --ozone-api-logout-button: {
*       background-color: darkred;
*       color: white;
*     };
*   }
* </style>
* <ozone-logout class="customStyle"></ozone-logout>
*
* ```
*
* ### Events
*
* If you need to capture ozone api events *ozone-api-request-success* and *ozone-api-request-success*.
* You can add events listeners on:
*     - $.login: OzoneApiLogin
* - $.logout: OzoneApiLogout
* - $.connectionStatus: OzoneApiAuthentication
*
*
* ### Styling
*
* The following custom properties and mixins are available for styling:
*
* Custom property | Description | Default
* ----------------|-------------|----------
*     `--ozone-api-logout-button` | css mixin for logout button| `{height:100%; width:auto; display:flex; justify-content: flex-end; align-items: center;}`
**/
declare class OzoneLogout extends Polymer.Element {
    /**
     * Indicate if the user is connected.
     * This property can be watch.
     */
    isConnected: boolean;
    /**
     * Error message display to explain why the connection fail.
     *
     */
    displayedMessage: string;
    /**
     * Disconnect from Ozone
     */
    ozoneDisconnect(): void;
}
