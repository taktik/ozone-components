import {OzoneAPIRequest} from 'ozone-api-request'
import * as Config from 'ozone-config';

/**
 * OzoneApiAuthentication class to manage Authentication API
 * Low level wrapper around ozone login, logout and authentication api
 * It use OzoneAPIRequest to perform ajax request. Report to OzoneAPIRequest documentation for fire events.
 *
 * ### Usage
 *
 * ```javascript
 * import {OzoneApiAuthentication, getOzoneApiAuthentication} from 'ozone-api-authentication'
 * ```
 */
export class OzoneApiAuthentication{


    private eventTarget: EventTarget = document;

    /**
     * Set event target to redirect OzoneAPIRequest events to an other target.
     * The default value is document
     * @param {EventTarget} element
     */
    setEventTarget(element: EventTarget){
        this.eventTarget = element;
    }

    /**
     * connect to ozone
     * @return {Promise<XMLHttpRequest>}
     */
    async ozoneConnect(username: string, password: string): Promise<XMLHttpRequest>{
        const config = await Config.OzoneConfig.get();

        const request = new OzoneAPIRequest();
        request.setEventTarget(this.eventTarget);
        request.method = 'POST';
        request.url = config.host + config.endPoints.login;
        request.body = JSON.stringify({
            username,
            password
        });
        return request.sendRequest();
    }

    /**
     * ozone logout
     * @return {Promise<XMLHttpRequest>}
     */
    async logout(): Promise<XMLHttpRequest>{
        const config = await Config.OzoneConfig.get();

        const request = new OzoneAPIRequest();
        request.setEventTarget(this.eventTarget);
        request.method = 'GET';
        request.url = config.host + config.endPoints.logout;

        return request.sendRequest();
    }

    /**
     * Verify ozone connection
     * @return {Promise<boolean>}
     */
    async checkConnectionStatus(): Promise<boolean>{
        const config = await Config.OzoneConfig.get();

        const request = new OzoneAPIRequest();
        request.setEventTarget(this.eventTarget);
        request.method = 'GET';
        request.url = config.host + config.endPoints.session;

        const response = await request.sendRequest();

        if (response.response && response.response.sessionId){
            return true
        } else {
            return false
        }
    }
}

const ozoneApiAuthentication =  new OzoneApiAuthentication();
/**
 * OzoneApiAuthentication factory
 * @return {OzoneApiAuthentication}
 */
export const getOzoneApiAuthentication= function ():OzoneApiAuthentication{
    return ozoneApiAuthentication
};
