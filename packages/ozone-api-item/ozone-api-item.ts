/// <amd-module name="ozone-api-item"/>

/**
 * Created by hubert on 8/06/17.
 */

import * as Config from 'ozone-config'
import {OzoneRequest} from 'ozone-request'
import {customElement, domElement, jsElement} from 'taktik-polymer-typeScript'
import {Item} from 'ozone-type'
import {SearchGenerator, SearchQuery} from 'ozone-search-helper';

export interface BulkResponse {
    response:Array<Item>;
}

export interface ItemResponse {
    response:Item;
}

/**
 * `ozone-api-item` is low level polymer module to ozone api.
 * It provide CRUD operation and search in a given collection.
 *
 * By default a `ozone-api-item` will be add in the root document
 * and can loaded form javaScript using *getOzoneApiItem*
 *
 * * Example in Html
 * ```html
 * <ozone-api-search id="myAPI" collection="item"></ozone-api-search>
 * ```
 * * Example
 * ```javaScript
 * const ozoneApiSearch = getOzoneApiItem(); // return instance of OzoneApiItem located in the dom
 * ```
 *
 * ### Events
 *
 * *configured* Fired when element is configured.
 *  This event will be fired if the config change.
 *
 */

@jsElement()
export class OzoneApiItem {


    /**
     * type of the ozone collection.
     * Default value is 'item'
     */
    private collection:string = 'item';


    on(collection: string){
        this.setCollection(collection);
        return this;
    }
    
    setCollection(collection: string){
        this.collection = collection;
    }

    /**
     * Create or update a collection item.
     * @param data Item item to create.
     * @return {Promise<Item>}
     */
    create(data:Item): Promise<Item> {
        return this.update(data);
    }

    /**
     * Create or update a collection item.
     * @param data Item item to update.
     * @return {Promise<Item>}
     */
    async update(data:Item): Promise<Item> {
        const url = await this._buildUrl('');
        return this._postRequest(url, data, this._readItemResponse);
    }

    /**
     * get one collection item by uuid.
     * @param id
     * @return {Promise<Item | null>}
     */
    async getOne(id:uuid):Promise<Item | null> {
        const url = await this._buildUrl(id);
        return this._getRequest(url)
            .then(response => {
                if(response == ''){
                    return null;
                } else {
                    return response
                }
            });
    }

    /**
     * delete one collection item by uuid.
     * @param id
     * @return {Promise<any>}
     */
    async deleteOne(id:uuid):Promise<uuid> {
        const url = await this._buildUrl(id);
        return this._deleteRequest(url);
    }

    /**
     * get collection items from a list of id.
     * @param ids {Array<uuid>} array of id to get
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    async bulkGet(ids:Array<uuid>):Promise<Array<Item>> {
        const url = await this._buildUrl('bulkGet');
        return this._postRequest(url, ids, this._readBulkItemResponse);
    }

    /**
     * delete items from a list of id.
     * @param ids
     * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
     */
    async bulkDelete(ids:Array<uuid| undefined>):Promise<Array<uuid>> {
        const url = await this._buildUrl('bulkDelete');
        return this._postRequest(url, ids, this._readItemResponse);
    }

    /**
     * save an array of items
     * @param items
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    async bulkSave(items:Array<Item>):Promise<Array<Item>> {
        const url = await this._buildUrl('bulkSave');
        return this._postRequest(url, items, this._readBulkItemResponse);
    }

    /**
     * Submit ozone search query
     */
    async search (search: SearchQuery): Promise<SearchGenerator> {
        const url = await this._buildUrl('search');
        return new SearchGenerator(url, search);
    }

    private _readItemResponse = (res:ItemResponse) => res.response;

    private _readBulkItemResponse =  (res:BulkResponse):Array<Item> => {
        return res.response;
    };

    private _postRequest(url:string, body:any, responseFilter:any): Promise<any> {
        const ozoneAccess = new OzoneRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'POST';
        ozoneAccess.body = JSON.stringify(body);
        return ozoneAccess
            .sendRequest().then(responseFilter.bind(this))
    }

    private _getRequest(url:string): Promise<any> {
        const ozoneAccess = new OzoneRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'GET';
        return ozoneAccess
            .sendRequest().then((res:any) => res.response)
    }

    private _deleteRequest(url:string): Promise<any> {
        const ozoneAccess = new OzoneRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'DELETE';
        return ozoneAccess
            .sendRequest().then((res:any) => res.response)
    }

    private async _buildUrl(action:string, type?: string ):Promise<string>{
        const config = await Config.OzoneConfig.get();
        const ozoneEndPoint = config.endPoints[this.collection];
        const serviceUrl = config.host + ozoneEndPoint;
        return `${serviceUrl}/${action}`;
    }
}