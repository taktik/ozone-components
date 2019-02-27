/**
 * Created by hubert on 8/06/17.
 */
import {Item, SearchRequest, ItemSearchResult, TermsAggregation, Aggregation,
    WildcardQuery, QueryStringQuery, TermQuery, ModeType, TermsQuery, TenantQuery, TypeQuery, Query, BoolQuery, Sort, IdsQuery, AggregationItem, RegexpQuery, RangeQuery} from 'ozone-type';




export interface SearchResponse {
    response: ItemSearchResult;
}

export interface SearchResult {
    results: Array<Item>;
    total: number;
    aggregations?: Array<AggregationItem>
}

export type BoolQueryName = 'mustClauses' | 'shouldClauses' | 'mustNotClauses'

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
 *   // ((type == 'aTypeor' or contains 'hello') and 'myField' == 'aText)
 *   // Order by 'creationDate'
 *   searchQuery
 *      .typeQuery('aType')
 *      .or.quicksearch('hello')
 *      .and.termQuery('myField','aText')
 *      .order('creationDate').DESC;
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
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
 * ```
 */
export class SearchQuery {
    _searchRequest: SearchRequest = {
        size: 10
    };

    _collection ?: string;

    /**
     * Set collection to search on.
     * @param {string} collection
     * @return {SearchQuery} this to be chained
     */
    on(collection: string){
        this._collection = collection;
        return this;
    }
    get collection(): string | undefined{
        return this._collection
    }
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
    boolQuery(kind: BoolQueryName):SearchQuery{

        const currentQuery = this._searchRequest.query? Object.assign({}, this._searchRequest.query): undefined;
        this._searchRequest.query = {
            "$type": "BoolQuery",
        } as BoolQuery;

        this._searchRequest.query[kind] = [];
        if(currentQuery)
            this._searchRequest.query[kind].push(currentQuery)

        return this;
    }

    /**
     * Combine query
     * @param searchQuery
     */
    combineWith(searchQuery: SearchQuery): SearchQuery{
        if(searchQuery._searchRequest && searchQuery._searchRequest.query){
            this.addQuery(searchQuery._searchRequest.query)
            return this;
        } else {
            throw Error('No query define in combineWith(searchQuery)')
        }
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
     * @param {boolean} ignoreCase
     * @return {SearchQuery}
     */
    termQuery(field: string, value: string, ignoreCase: boolean = false): SearchQuery {
        return this.addQuery({
            "$type": "TermQuery",
            field: field,
            value: value,
            ignoreCase
        } as TermQuery);
    }

    termsQuery(field: string, ...values: Array<string>): SearchQuery {
        return this.addQuery({
            "$type": "TermsQuery",
            field,
            values
        } as TermsQuery);
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
     * search array of ids
     * @param {string} ids
     * @return {SearchQuery}
     */
    idsQuery(...ids: Array<string>): SearchQuery {
        return this.addQuery({
            "$type": "IdsQuery",
            ids,
        } as IdsQuery);
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
     * Search inside a tenant
     * @param {Mode} mode
     * @param {string} tenantId
     * @return {SearchQuery}
     */
    tenantQuery(mode: ModeType, tenantId: string): SearchQuery {
        return this.addQuery({
            "$type": "TenantQuery",
            mode: mode,
            tenantId: tenantId
        } as TenantQuery);
    }

    /**
     * Search for auto complete
     * @param {string} searchString
     * @param {string?} lastTerm
     * @param {number?} size
     * @return {SearchQuery}
     */
    suggestion(searchString: string, lastTerm:string = '', size?: number){
        const suggestSize = size || this.size;

        this._searchRequest.aggregations = [{
            "$type": "TermsAggregation",
            name: "suggest",
            field: "_quicksearch",
            order: "COUNT_DESC",
            size: suggestSize,
            includePattern: `${lastTerm}.*`
        } as TermsAggregation];

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
     * Search in a range of value
     * @param field
     * @param param {from?: any, to?: any}
     */
    rangeQuery(field: string, param: {from?: any, to?: any}): SearchQuery{
        const query: RangeQuery = Object.assign({
            "$type": "RangeQuery",
            field
        }, param);

        return this.addQuery(query);
    }

    /**
     * Search with a regular expression
     * @param field
     * @param regexp
     * @param ignoreCase
     */
    regexpQuery(field: string, regexp: string, ignoreCase: boolean = false): SearchQuery{
        const query: RegexpQuery = {
            '$type':'RegexpQuery',
            field,
            regexp,
            ignoreCase
        };
        return this.addQuery(query)
    }
    /**
     * Matches documents that have fields matching a wildcard expression (not analyzed).
     * Supported wildcards are *, which matches any character sequence (including the empty one), and ?,
     * which matches any single character. Note that this query can be slow, as it needs to iterate over many terms.
     * In order to prevent extremely slow wildcard queries,
     * a wildcard term should not start with one of the wildcards * or ?.
     * The wildcard query maps to Lucene WildcardQuery.
     * @param field
     * @param wildcard
     * @param ignoreCase
     * @param analyzed
     */
    wildcardQuery(field: string, wildcard: string,ignoreCase?: boolean, analyzed?: boolean): SearchQuery{
        const query: WildcardQuery = {
            '$type':'WildcardQuery',
            field,
            wildcard,
            ignoreCase,
            analyzed
        };
        return this.addQuery(query)
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


    /**
     * function to an order on a field
     * @param {string} field
     * @param {Sort.OrderEnum} order
     * @return {this}
     */
    addOrderOn(field: string, order: Sort.OrderEnum){
        this._searchRequest.sorts = this._searchRequest.sorts || [];
        this._searchRequest.sorts.push({
            field,
            order
        })
        return this;
    }

    /**
     * Short hand to field oder in chain configuration.
     * Has to be follow by ASC, DESC or NONE
     * @param {string} field field to search on.
     * @return {OrderRequest}
     */
    order(field: string):OrderRequest{
        return new OrderRequest(this, field)
    }

}
export class OrderRequest{
    request: SearchQuery;
    field: string;
    constructor(request: SearchQuery, field: string){
        this.request = request;
        this.field = field;
    }
    get ASC ():SearchQuery { return this.request.addOrderOn(this.field, 'ASC' as any)}
    get DESC ():SearchQuery { return this.request.addOrderOn(this.field, 'DESC'as any)}
    get NONE ():SearchQuery { return this.request.addOrderOn(this.field, 'NONE'as any)}

}
