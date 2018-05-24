/**
 * Created by hubert on 8/06/17.
 */

import * as Config from 'ozone-config'
import {OzoneAPIRequest} from 'ozone-api-request'
import {customElement, domElement, jsElement} from 'taktik-polymer-typescript'
import {Item} from 'ozone-type'
import {SearchResponse, SearchResult, SearchQuery} from "ozone-search-helper";

export interface BulkResponse {
    response:Array<Item>;
}

export interface ItemResponse {
    response:Item;
}

/**
 * `ozone-api-item` is low level es6 module to ozone api.
 * It provide CRUD operation and search in a given collection.
 *
 * * Example
 * ```javaScript
 * const ozoneApiSearch = new OzoneApiItem(); // return instance of OzoneApiItem located in the dom
 * const result = ozoneApiSearch.on('item').getOne('an-id');
 * ```
 *
 */

@jsElement()
export class OzoneApiItem {

    /**
     * type of the ozone collection.
     * Default value is 'item'
     */
    private collection:string = 'item';

    /**
     * set collection and return this to be chain by a query.
     * @param {string} collection
     * @return {OzoneApiItem} this
     */
    on(collection: string){
        this.setCollection(collection);
        return this;
    }

    /**
     * Set ozone collection to query
     * @param {string} collection
     */
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
        return this._postRequest(url, data, this._readItemResponse.bind(this));
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
        return this._postRequest(url, ids, this._readBulkItemResponse.bind(this));
    }

    /**
     * delete items from a list of id.
     * @param ids
     * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
     */
    async bulkDelete(ids:Array<uuid| undefined>):Promise<Array<uuid>> {
        const url = await this._buildUrl('bulkDelete');
        return this._postRequest(url, ids, this._readItemResponse.bind(this));
    }

    /**
     * save an array of items
     * @param items
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    async bulkSave(items:Array<Item>):Promise<Array<Item>> {
        const url = await this._buildUrl('bulkSave');
        return this._postRequest(url, items, this._readBulkItemResponse.bind(this));
    }

    /**
     * Submit ozone search query
     */
    async search (search: SearchQuery): Promise<SearchGenerator> {
        if(search.collection){
            this.on(search.collection)
        }
        const url = await this._buildUrl('search');
        return new SearchGenerator(url, search, this);
    }

    private _readItemResponse = (res:ItemResponse) => res.response;

    private _readBulkItemResponse =  (res:BulkResponse):Array<Item> => {
        return res.response;
    };


    async waitRequestFinish():Promise<any>{
        if(this.pendingRequest){
            return this.pendingRequest.donePromise
        } else
            return Promise.resolve();
    }

    private pendingRequest?: OzoneAPIRequest;


    private async getNewRequest(): Promise<OzoneAPIRequest>{
        if(this.pendingRequest){
            await this.pendingRequest.donePromise
        }
        this.pendingRequest = new OzoneAPIRequest()
        return this.pendingRequest
    }

    async _postRequest(url:string, body:any, responseFilter:any): Promise<any> {
        const ozoneAccess = await this.getNewRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'POST';
        if(typeof body === "string")
            ozoneAccess.body = body
        else
            ozoneAccess.body = JSON.stringify(body);
        return ozoneAccess
            .sendRequest().then(responseFilter)
    }

    private async _getRequest(url:string): Promise<any> {
        const ozoneAccess = await this.getNewRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'GET';
        return ozoneAccess
            .sendRequest().then((res:any) => res.response)
    }

    private async _deleteRequest(url:string): Promise<any> {
        const ozoneAccess = await this.getNewRequest();
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

/**
 * Class helper to iterate on search result.
 * * Example:
 * ```javaScript
 *   let searchQuery = new SearchQuery();
 *   searchQuery.quicksearch('');
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
 *   searchGenerator.next().then((searchResult)=>{
 *               searchResult.results.forEach((item)=>{
 *                   this.push('items', item);
 *               })
 *           });
 * ```
 */
@jsElement()
export class SearchGenerator {
    searchParam:SearchQuery;
    url:string;
    total: number = 0;
    offset:number = 0;
    hasMoreData:boolean = true;

    api : OzoneApiItem

    constructor(url:string, searchParam: SearchQuery, api: OzoneApiItem){
        this.searchParam = searchParam;
        this.url = url;
        this.api = api;
    }

    /**
     * load next array of results
     * @return {Promise<SearchResult>}
     */
    next(): Promise<SearchResult|null>{
        if(this.hasMoreData) {
            this.searchParam.offset = this.offset;
            return this.api._postRequest(this.url, this.searchParam.searchQuery, this._readSearchResponse.bind(this));
        } else {
            return Promise.resolve(null)
        }
    }

    /**
     * Request all remaining result
     */
    async getAll(): Promise<SearchResult|null>{
        let result: SearchResult = {results: [], total:0};
        if(this.total === 0){
            result = (await this.next()) || result;
        }
        if(this.hasMoreData && this.offset < this.total){
            this.searchParam.size = this.total
            const result2 = await this.next();
            if(result2){
                result.results = [ ...result.results, ...result2.results]
            }
        }
        return result;
    }

    private _readSearchResponse (res:SearchResponse):SearchResult {
        const response = res.response;
        if(response) {
            let aggregations = response.aggregations;


            this.total = Number(response.total);
            this.offset += Number(response.size);
            this.hasMoreData = this.offset < this.total;
            let results = response.results || [];
            return {
                results,
                total: this.total,
                aggregations
            };
        } else {
            let results: Array<Item> = []
            return {
                results,
                total: this.total,
            };
        }
    }
}