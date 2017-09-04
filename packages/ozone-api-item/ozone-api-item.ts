/// <amd-module name="ozone-api-item"/>

/**
 * Created by hubert on 8/06/17.
 */


import "polymer/polymer-element.html";
import "iron-ajax/iron-ajax.html";
import "ozone-api-behaviors/ozone-api-ajax-mixin.html";
import './ozone-api-item.html'

import {customElement, domElement} from 'taktik-polymer-typeScript'
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
@customElement('ozone-api-item')
export class OzoneApiItem  extends OzoneApiAjaxMixin(Polymer.Element){

    @domElement()
    $: {
        ozoneAccess:IronAjax,
    };


    /**
     * type of the ozone collection.
     * Default value is 'item'
     */
    collection:string;


    static get properties() {
        return {
            collection: {
                type: String,
                notify: false,
                value: 'item'
            }
        }
    }

    static get observers() {
        return [
            '_collectionChange(collection, config.endPoints.*)'
        ];
    }

    /**
     * observer on collection
     * @private
     */
    private _collectionChange(collection: string, endpoints: any): void{

        if(collection && endpoints.value && this.config){
            this.computeServiceUrl(endpoints.value[collection]);
                this.dispatchEvent(new CustomEvent('configured',
                    {bubbles: true, composed: true}));
        }
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
    update(data:Item): Promise<Item> {
        const url = this._buildUrl('');
        return this._postRequest(url, data, this._readItemResponse);
    }

    /**
     * get one collection item by uuid.
     * @param id
     * @return {Promise<Item | null>}
     */
    getOne(id:uuid):Promise<Item | null> {
        const url = this._buildUrl(id);
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
    deleteOne(id:uuid):Promise<uuid> {
        const url = this._buildUrl(id);
        return this._deleteRequest(url);
    }

    /**
     * get collection items from a list of id.
     * @param ids {Array<uuid>} array of id to get
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    bulkGet(ids:Array<uuid>):Promise<Array<Item>> {
        const url = this._buildUrl('bulkGet');
        return this._postRequest(url, ids, this._readBulkItemResponse);
    }

    /**
     * delete items from a list of id.
     * @param ids
     * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
     */
    bulkDelete(ids:Array<uuid| undefined>):Promise<Array<uuid>> {
        const url = this._buildUrl('bulkDelete');
        return this._postRequest(url, ids, this._readItemResponse);
    }

    /**
     * save an array of items
     * @param items
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    bulkSave(items:Array<Item>):Promise<Array<Item>> {
        const url = this._buildUrl('bulkSave');
        return this._postRequest(url, items, this._readBulkItemResponse);
    }

    /**
     * Submit ozone search query
     */
    search (search: SearchQuery): SearchGenerator {
        const url = this._buildUrl('search');

        return new SearchGenerator(url, search, this.$.ozoneAccess);
    }

    private _readItemResponse = (res:ItemResponse) => res.response;

    private _readBulkItemResponse =  (res:BulkResponse):Array<Item> => {
        return res.response;
    };

    private _postRequest(url:string, body:any, responseFilter:any): Promise<any> {
        this.$.ozoneAccess.url = url;
        this.$.ozoneAccess.method = 'POST';
        this.$.ozoneAccess.body = JSON.stringify(body);
        return this.$.ozoneAccess
            .generateRequest().completes.then(responseFilter.bind(this))
    }

    private _getRequest(url:string): Promise<any> {
        this.$.ozoneAccess.url = url;
        this.$.ozoneAccess.method = 'GET';
        return this.$.ozoneAccess
            .generateRequest().completes.then((res:any) => res.response)
    }

    private _deleteRequest(url:string): Promise<any> {
        this.$.ozoneAccess.url = url;
        this.$.ozoneAccess.method = 'DELETE';
        return this.$.ozoneAccess
            .generateRequest().completes.then((res:any) => res.response)
    }

    private _buildUrl(action:string):string{
        return `${this.serviceUrl}/${action}`;
    }



}

function OzoneApiItemGenerator() {
    let ozoneItemAPI;

    return ():OzoneApiItem => {
        if (!document.querySelector('#ozoneItemAPI')) {
            ozoneItemAPI = document.createElement('ozone-api-item');
            ozoneItemAPI.id = 'ozoneItemAPI';
            document.body.appendChild(ozoneItemAPI);
        }
        return document.querySelector('#ozoneItemAPI') as OzoneApiItem;
    }
}
/**
 * return OzoneApiItem singleton
 * @type {()=>OzoneApiItem}
 */
export const getOzoneApiItem = OzoneApiItemGenerator();
