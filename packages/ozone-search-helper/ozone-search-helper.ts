/// <amd-module name="ozone-search-helper"/>

/**
 * Created by hubert on 8/06/17.
 */

import {jsElement} from 'taktik-polymer-typeScript'
import {Item, SearchRequest, ItemSearchResult} from 'ozone-type'
import {OzoneRequest} from 'ozone-request'

export interface SearchResponse {
    response: ItemSearchResult;
}

export interface SearchResult {
    results: Array<Item>;
    total: number;
}

/**
 * Class helper to create searchQuery.
 * * Example:
 * ```javaScript
 *   let searchQuery = new SearchQuery();
 *   searchQuery.quicksearch('');
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
 *
 * ```
 */
@jsElement()
export class SearchQuery {
    _searchRequest: SearchRequest = {
        size: 10
    };

    get searchQuery () {return JSON.stringify(this._searchRequest)}

    get size(): number{return this._searchRequest.size || 0;}
    set size(size: number) {this._searchRequest.size = size;}
    get offset(): number{return this._searchRequest.offset || 0;}
    set offset(size: number) {this._searchRequest.offset = size;}


    /**
     *
     * @param searchString
     */
    quicksearch(searchString: string): void {

        let searchParam:SearchRequest = {};

        searchParam.size = this.size;
        searchParam.query = {
            "$type": "QueryStringQuery",
            "field": "_quicksearch",
            "queryString": `${searchString}*`
        };

        this._searchRequest = searchParam;
    }

    suggestion(searchString: string, lastTerm?:string){
        let searchParam:SearchRequest = {};
        if(lastTerm) {
            searchParam.aggregations = [{
                "$type": "TermsAggregation",
                name: "suggest",
                field: "_quicksearch",
                order: "COUNT_DESC",
                size: this.size,
                includePattern: `${lastTerm}.*`
            }];
        }
        searchParam.query = {
            $type: "QueryStringQuery",
            field: "_quicksearch",
            queryString: `${searchString}*`
        };
        this._searchRequest = searchParam;
    }

    custom(searchParam:SearchRequest){
        this._searchRequest = searchParam;
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
    total: number;
    offset:number = 0;
    done:boolean = false;

    constructor(url:string, searchParam: SearchQuery){
        this.searchParam = searchParam;
        this.url = url;
    }

    /**
     * load next array of results
     * @return {Promise<SearchResult>}
     */
    next(): Promise<SearchResult>{
        this.searchParam.offset = this.offset;
        return this._postRequest(this.url, this.searchParam.searchQuery, this._readSearchResponse);
    }

    private _postRequest(url:string, body:string, responseFilter:any): Promise<any> {
        const ozoneAccess =  new OzoneRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'POST';
        ozoneAccess.body = body;
        return ozoneAccess
            .sendRequest().then(responseFilter.bind(this))
    }

    private _readSearchResponse (res:SearchResponse):SearchResult {
        this.total = Number(res.response.total);
        this.offset += Number(res.response.size);
        this.done = this.offset < this.total;
        let results = res.response.results || [];
        return {
            results,
            total: this.total
        };
    }

}