/**
 * Created by hubert on 8/06/17.
 */

import * as Config from 'ozone-config'
import {OzoneAPIRequest} from 'ozone-api-request'
import {customElement, domElement, jsElement} from 'taktik-polymer-typescript'
import {Item, ItemSearchResult} from 'ozone-type'
import {SearchResponse, SearchResult, SearchQuery} from "ozone-search-helper";
import {v4 as uuid} from 'uuid';

/**
 * Function decorator decorator to be used to wait until 
 * all other decorated function resolve.
 * This decorator is aimed to be used in class that implement StatefulOzone.
 * It's purpose is to wait others ozone call finish, before sending a next one.
 * 
 */
export function lockRequest() {
    return function (target: StatefulOzone, propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value;

        descriptor.value = function() {
            const self: StatefulOzone = this as any;
            const arg = arguments;

            self._currentRequest = self._currentRequest
                .catch()
                .then(()=> {
                    return originalMethod.apply(this, arg);
                });
            return self._currentRequest
        };
    }
}


export interface StatefulOzone {
    _currentRequest: Promise<any>
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
export class OzoneApiItem<T = Item> {

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
    create(data:T): Promise<T | null> {
        return this.update(data);
    }

    /**
     * Create or update a collection item.
     * @param data Item item to update.
     * @return {Promise<Item>}
     */
    async update(data:T): Promise<T | null> {
        const url = await this._buildUrl('');
        return this._postRequest<T>(url, data, this._readResponse<T>());
    }

    /**
     * get one collection item by uuid.
     * @param id
     * @return {Promise<Item | null>}
     */
    async getOne(id:uuid):Promise<T | null> {
        const url = await this._buildUrl(id);
        return this._getRequest<T>(url);
    }

    /**
     * delete one collection item by uuid.
     * @param id
     * @return {Promise<any>}
     */
    async deleteOne(id:uuid):Promise<uuid| null> {
        const url = await this._buildUrl(id);
        return this._deleteRequest<uuid>(url);
    }

    /**
     * get collection items from a list of id.
     * @param ids {Array<uuid>} array of id to get
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    async bulkGet(ids:Array<uuid>):Promise<Array<T> | null> {
        const url = await this._buildUrl('bulkGet');
        return this._postRequest<Array<T>>(url, ids, this._readResponse<Array<T>>());
    }

    /**
     * delete items from a list of id.
     * @param ids
     * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
     */
    async bulkDelete(ids:Array<uuid| undefined>):Promise<Array<uuid> | null> {
        const url = await this._buildUrl('bulkDelete');
        return this._postRequest<Array<uuid>>(url, ids, this._readResponse<Array<uuid>>());
    }

    /**
     * save an array of items
     * @param items
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    async bulkSave(items:Array<T>):Promise<Array<T> | null> {
        const url = await this._buildUrl('bulkSave');
        return this._postRequest<Array<T>>(url, items, this._readResponse<Array<T>>());
    }

    /**
     * Submit ozone search query
     */
    async search (search: SearchQuery): Promise<SearchGenerator<T>> {
        if(search.collection){
            this.on(search.collection)
        }
        const url = await this._buildUrl('search');
        return new SearchGenerator(url, search, this);
    }

    private _readResponse<T> (): (res:XMLHttpRequest) => T | null {
        return (res:XMLHttpRequest) => {
            return res.response as T || null;
        }
    };

    async _postCancelableRequest(url:string, body:any, responseFilter:any): Promise<any> {

    }

    private async getNewRequest(): Promise<OzoneAPIRequest>{
        return new OzoneAPIRequest()
    }

    async _post(url:string, body:any): Promise<OzoneAPIRequest> {
        const ozoneAccess = await this.getNewRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'POST';
        if(typeof body === "string")
            ozoneAccess.body = body
        else
            ozoneAccess.body = JSON.stringify(body);
        return ozoneAccess.send()
    }

    async _postRequest<T>(url:string, body:any, responseFilter:(response: XMLHttpRequest) => T | null): Promise<T | null> {
        const request = await this._post(url, body);
        return request.result.then(responseFilter)
    }

    private async _getRequest<T>(url:string): Promise<T | null> {
        const ozoneAccess = await this.getNewRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'GET';
        return ozoneAccess
            .sendRequest().then((res:any) => res.response)
    }

    private async _deleteRequest<T>(url:string): Promise< T | null> {
        const ozoneAccess = await this.getNewRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'DELETE';
        return ozoneAccess
            .sendRequest().then((res) => res.response)
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
export class SearchGenerator<T = Item> implements StatefulOzone{
    _currentRequest: Promise<any> = Promise.resolve();
    searchParam:SearchQuery;
    url:string;
    total: number = 0;
    offset:number = 0;
    hasMoreData:boolean = true;
    currentRequest?: OzoneAPIRequest;
    _canceled = false;
    id = uuid();

    api : OzoneApiItem<T>;

    constructor(url:string, searchParam: SearchQuery, api: OzoneApiItem<T>){
        this.searchParam = searchParam;
        this.url = url;
        this.api = api;
    }

    /**
     * load next array of results
     * @return {Promise<SearchResult>}
     */
    @lockRequest()
    async next(): Promise<SearchResult|null>{
        if(this.hasMoreData && !this._canceled) {
            this.searchParam.offset = this.offset;
            this.currentRequest = await this.api._post(this.url, this.searchParam.searchQuery);

            return this._readSearchResponse(await this.currentRequest.result);
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
            this.searchParam.size = this.total;
            const result2 = await this.next();
            if(result2){
                result.results = [ ...result.results, ...result2.results]
            }
        }
        return result;
    }

    cancelRequest(): void{
        this._canceled = true;
        if(this.currentRequest)
            return this.currentRequest.abort();
    }

    private _readSearchResponse (res: XMLHttpRequest):SearchResult {
        if(res && res.response) {
            const response = res.response as ItemSearchResult;
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
            let results: Array<Item> = [];
            return {
                results,
                total: this.total,
            };
        }
    }
}