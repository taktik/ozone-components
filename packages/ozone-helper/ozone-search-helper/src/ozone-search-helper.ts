/// <amd-module name="ozone-search-helper"/>

/**
 * Created by hubert on 8/06/17.
 */

import {jsElement} from 'taktik-polymer-typescript'
import {Item, SearchRequest, ItemSearchResult, TermsAggregation, Aggregation, QueryStringQuery, TermQuery, TypeQuery, Query, BoolQuery} from 'ozone-type'
import {OzoneAPIRequest} from 'ozone-api-request'
import {isNull} from "util";

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
 * ```
 *
 * Search query can be chain.
 *  * Example:
 * ```javaScript
 *   let searchQuery = new SearchQuery();
 *   // (type == 'aTypeor' or contains 'hello') and 'myField' == 'aText'
 *   searchQuery
 *      .typeQuery('aType')
 *      .or.quicksearch('hello')
 *      .and.termQuery('myField','aText');
 *
 *   searchQuery.quicksearch('').and;
 *
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
 *
 *  * Example:
 * ```javaScript
 *   let searchQuery = new SearchQuery();
 *   // type == 'aTypeor' or contains 'hello' or 'myField' == 'aText'
 *   searchQuery
 *      .typeQuery('aType')
 *      .or
 *         .quicksearch('hello')
 *         .termQuery('myField','aText');
 *
 *   searchQuery.quicksearch('').and;
 *
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
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
     * create boolQuery mustClauses.
     * @return {SearchQuery}
     */
    get and(): SearchQuery {
        return this.boolQuery('mustClauses')
    }

    /**
     * create boolQuery shouldClauses.
     * @return {SearchQuery}
     */
    get or(): SearchQuery {
        return this.boolQuery('shouldClauses')
    }

    /**
     * create boolQuery mustNotClauses (nand).
     * @return {SearchQuery}
     */
    get not(): SearchQuery {
        return this.boolQuery('mustNotClauses')
    }

    /**
     * set search request size
     * Can be chain.
     * @param {number} size
     * @return {SearchQuery} this
     */
    setSize(size: number): SearchQuery{
        this.size = size;
        return this;
    }

    /**
     * generic boolQuery
     * Can be chain.
     * @param {string} kind kind of bool query
     * @return {SearchQuery}
     */
    boolQuery(kind: string):SearchQuery{
        const currentQuery = Object.assign({}, this._searchRequest.query)
        this._searchRequest.query = {
            "$type": "BoolQuery",
        } as BoolQuery;

        this._searchRequest.query[kind] = [currentQuery]
        return this;
    }

    /**
     * ozone QueryStringQuery
     * @param {string} searchString string to search
     */
    quicksearch(searchString: string): SearchQuery {
        return this.addQuery({
            "$type": "QueryStringQuery",
            field: "_quicksearch",
            queryString: `${searchString}*`
        } as QueryStringQuery);
    }

    /**
     * search for a term in a field
     * @param {string} field
     * @param {string} value
     * @return {SearchQuery}
     */
    termQuery(field: string, value: string): SearchQuery {
        return this.addQuery({
            "$type": "TermQuery",
            field: field,
            value: value
        } as TermQuery);
    }

    /**
     * search inside a type.
     * Not un subtype
     * @param {string} typeIdentifiers
     * @return {SearchQuery}
     */
    typeQuery(...typeIdentifiers: Array<string>): SearchQuery {
        return this.genericTypeQuery(false, ...typeIdentifiers);
    }

    /**
     * search inside a type and it's subtype
     * @param {string} typeIdentifiers
     * @return {SearchQuery}
     */
    typeQueryWithSubType(...typeIdentifiers: Array<string>): SearchQuery {
        return this.genericTypeQuery(true, ...typeIdentifiers);
    }

    /**
     * Search inside a type
     * @param {boolean} includeSubTypes
     * @param {string} typeIdentifiers
     * @return {SearchQuery}
     */
    private genericTypeQuery(includeSubTypes: boolean, ...typeIdentifiers: Array<string>): SearchQuery {
        return this.addQuery({
            "$type": "TypeQuery",
            typeIdentifiers: typeIdentifiers,
            includeSubTypes: includeSubTypes
        } as TypeQuery);
    }

    /**
     * Search for auto complete
     * @param {string} searchString
     * @param {string?} lastTerm
     * @param {number?} size
     * @return {SearchQuery}
     */
    suggestion(searchString: string, lastTerm?:string, size?: number){
        const suggestSize = size || this.size;
        if(lastTerm) {
            this._searchRequest.aggregations = [{
                "$type": "TermsAggregation",
                name: "suggest",
                field: "_quicksearch",
                order: "COUNT_DESC",
                size: suggestSize,
                includePattern: `${lastTerm}.*`
            } as TermsAggregation];
        }

        return this.quicksearch(searchString);
    }

    /**
     * create a custom searchRequest.
     * Can not be chained
     * @param {SearchRequest} searchParam
     * @return {SearchQuery}
     */
    custom(searchParam:SearchRequest): void{
        this._searchRequest = searchParam;
    }

    /**
     *
     * @param {Query} query
     * @return {SearchQuery}
     */
    addQuery(query: Query): SearchQuery{

        if(this._searchRequest.query && this._searchRequest.query.$type === 'BoolQuery'){
            const currentQuery = (this._searchRequest.query as BoolQuery);
            if(currentQuery.mustClauses){
                currentQuery.mustClauses.push(query)
            } else if(currentQuery.shouldClauses){
                currentQuery.shouldClauses.push(query)
            } else if(currentQuery.mustNotClauses){
                currentQuery.mustNotClauses.push(query)
            } else {
                throw new Error('unsupported BoolQuery')
            }
        } else {
            this._searchRequest.query = query;
        }

        return this
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
    total: number = NaN;
    offset:number = 0;
    dataRemain:boolean = true;

    constructor(url:string, searchParam: SearchQuery){
        this.searchParam = searchParam;
        this.url = url;
    }

    /**
     * load next array of results
     * @return {Promise<SearchResult>}
     */
    next(): Promise<SearchResult|null>{
        if(this.dataRemain) {
            this.searchParam.offset = this.offset;
            return this._postRequest(this.url, this.searchParam.searchQuery, this._readSearchResponse);
        } else {
            return Promise.resolve(null)
        }
    }

    private _postRequest(url:string, body:string, responseFilter:any): Promise<any> {
        const ozoneAccess =  new OzoneAPIRequest();
        ozoneAccess.url = url;
        ozoneAccess.method = 'POST';
        ozoneAccess.body = body;
        return ozoneAccess
            .sendRequest().then(responseFilter.bind(this))
    }

    private _readSearchResponse (res:SearchResponse):SearchResult {
        this.total = Number(res.response.total);
        this.offset += Number(res.response.size);
        this.dataRemain = this.offset < this.total;
        let results = res.response.results || [];
        return {
            results,
            total: this.total
        };
    }

}