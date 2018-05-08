/// <amd-module name="ozone-api-request"/>


import {jsElement} from 'taktik-polymer-typescript'

/**
 * OzoneAPIRequest is a light wrapper over XMLHttpRequest to manager AJAX request to Ozone.
 *
 * ### Events
 *
 * * *ozone-api-request-success* Fired when connection to ozone succeeds.
 * Event detail contains the XMLHttpRequest.
 *
 * * *ozone-api-request-error* Fired when connection to ozone fails.
 * Event detail contains the XMLHttpRequest.
 *

 * * *ozone-api-request-timeout* Fired when connection timeout.
 * Event detail contains the XMLHttpRequest.
 *
 * * *ozone-api-request-unauthorized* Fired when server return 403 unauthorized.
 * Event detail contains the XMLHttpRequest.
 *
 *
 * ### Usage
 *
 * * Basic usage with promise
 * ```typeScript
 * const OzoneAPIRequest = new OzoneAPIRequest();
 * OzoneAPIRequest.url = url;
 * OzoneAPIRequest.method = 'GET';
 * OzoneAPIRequest.sendRequest()
 *    .then((res:XMLHttpRequest) => {
 *        // Do something with XMLHttpRequest
 *        console.log(res.response)
 *    })
 *    .catch((failRequest)=>{
 *        // Do something with XMLHttpRequest to handel the error.
 *        console.error(failRequest.statusText)
 *    })
 * ```
 *
 *
 * * Usage with Event handler
 * ```typeScript
 * this.addEventListener('ozone-api-request-success', (event: Event) => {
 *        // Do something with XMLHttpRequest
 *        console.log(event.detail.response)
 *    })
 * this.addEventListener('ozone-api-request-error', (event: Event) => {
 *        // Do something with XMLHttpRequest to handel the error.
 *        console.error(event.detail.statusText)
 *    })
 * const OzoneAPIRequest = new OzoneAPIRequest();
 * OzoneAPIRequest.setEventTarget(this)
 * OzoneAPIRequest.url = url;
 * OzoneAPIRequest.method = 'GET';
 * OzoneAPIRequest.sendRequest();
 * ```
 * 
 * * Modify request before send
 * ```typeScript
 * const OzoneAPIRequest = new OzoneAPIRequest();
 * OzoneAPIRequest.url = url;
 * OzoneAPIRequest.method = 'GET';
 * const request = OzoneAPIRequest.createXMLHttpRequest();
 * // Modify default request
 * request.setRequestHeader('Cache-Control', 'only-if-cached');
 *
 * OzoneAPIRequest.sendRequest(request);
 * // Handel response
 * ```
 * 
 */
@jsElement()
export class OzoneAPIRequest{
    private _url: string ='';
    private _method: string = 'GET';
    private _body: string | FormData = '';
    private _responseType: XMLHttpRequestResponseType = 'json';


    set url (url: string){
        this._url = url;
    }
    get url():  string{ return this._url}

    set body (body: string | FormData){
        this._body = body;
    }
    get body (): string | FormData { return this._body}

    set method(method:string){
        this._method = method;
    }
    get method (): string {return this._method;}

    set responseType(responseType:XMLHttpRequestResponseType){
        this._responseType = responseType;
    }
    get responseType (): XMLHttpRequestResponseType {return this._responseType;}

    private currentRequest: XMLHttpRequest | null = null ;

    private _onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null = null
    set onreadystatechange(callback: ((this: XMLHttpRequest, ev: Event) => any)){
    this._onreadystatechange = callback;
    }

    abort(){
        if(this.currentRequest)
            this.currentRequest.abort();
    }

    /**
     * Create and open an XMLHttpRequest
     * @return {XMLHttpRequest}
     */
    createXMLHttpRequest(withHeader: boolean = true): XMLHttpRequest{
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        
        xmlhttp.open(this.method, this.url, true);
        xmlhttp.responseType = this.responseType;
        if(withHeader) {
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.setRequestHeader('Accept', 'application/json');
        }
        return xmlhttp;
    }

    /**
     * eventTarget to dispatch *ozone-api-request-success* and *ozone-api-request-error* events
     * Default value is document.
     * @type {EventTarget}
     */
    eventTarget: EventTarget = document;
    setEventTarget(element: EventTarget){
        this.eventTarget = element;
    }

    /**
     *
     * @param {XMLHttpRequest} request (optional) This parameters overwrite the default XmlHttpRequest.
     * @return {Promise<XMLHttpRequest>}
     */
    sendRequest(request?: XMLHttpRequest):Promise<XMLHttpRequest>{
        const xmlhttp = this.currentRequest =request || this.createXMLHttpRequest();
        xmlhttp.onreadystatechange = this._onreadystatechange;

        return new Promise((resolve, reject)=>{

            const handleResponse = ()=>{
                switch (xmlhttp.status){
                    case 200:
                        this.eventTarget.dispatchEvent(new CustomEvent<XMLHttpRequest>('ozone-api-request-success', {
                            bubbles: true, detail: xmlhttp
                        }));
                        resolve(xmlhttp);
                        break;
                    case 403:
                        this.eventTarget.dispatchEvent(new CustomEvent<XMLHttpRequest>('ozone-api-request-unauthorized', {
                            bubbles: true, detail: xmlhttp
                        }));
                        reject(xmlhttp);
                        break;
                    default:
                        this.eventTarget.dispatchEvent(new CustomEvent<XMLHttpRequest>('ozone-api-request-error', {
                            bubbles: true, detail: xmlhttp
                        }));
                        reject(xmlhttp);
                }
            };

            xmlhttp.onload = handleResponse;

            xmlhttp.ontimeout = () =>{
                this.eventTarget.dispatchEvent(new CustomEvent<XMLHttpRequest>('ozone-api-request-timeout', {
                    bubbles: true, detail: xmlhttp
                }));
                reject(xmlhttp);
            };

            xmlhttp.onerror = handleResponse;

            xmlhttp.send(this.body);
        });
    }
}