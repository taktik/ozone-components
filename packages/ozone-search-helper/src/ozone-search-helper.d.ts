import { Item, SearchRequest, ItemSearchResult } from 'ozone-type';
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
export declare class SearchQuery {
    _searchRequest: SearchRequest;
    readonly searchQuery: string;
    size: number;
    offset: number;
    /**
     *
     * @param searchString
     */
    quicksearch(searchString: string): void;
    suggestion(searchString: string, lastTerm?: string): void;
    custom(searchParam: SearchRequest): void;
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
export declare class SearchGenerator {
    searchParam: SearchQuery;
    url: string;
    total: number;
    offset: number;
    done: boolean;
    constructor(url: string, searchParam: SearchQuery);
    /**
     * load next array of results
     * @return {Promise<SearchResult>}
     */
    next(): Promise<SearchResult>;
    private _postRequest(url, body, responseFilter);
    private _readSearchResponse(res);
}
