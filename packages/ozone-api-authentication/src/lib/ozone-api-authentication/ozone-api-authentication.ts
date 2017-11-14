import {OzoneAPIRequest} from 'ozone-api-request'
import * as Config from 'ozone-config';

/**
 * OzoneApiAuthentication class to manage Authentication API
 *
 *
 * ### Usage
 *
 * ```javascript
 * ```
 */
export class OzoneApiAuthentication{


    eventTarget: EventTarget = document;
    setEventTarget(element: EventTarget){
        this.eventTarget = element;
    }

    _connectionMessage: string;


    /**
     * connect to ozone
     * @return {Promise<string>}
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

    async logout(): Promise<XMLHttpRequest>{
        const config = await Config.OzoneConfig.get();

        const request = new OzoneAPIRequest();
        request.setEventTarget(this.eventTarget);
        request.method = 'GET';
        request.url = config.host + config.endPoints.logout;

        return request.sendRequest();
    }

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
