/// <amd-module name="ozone-search-helper"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("ozone-search-helper", ["require", "exports", "taktik-polymer-typeScript"], function (require, exports, taktik_polymer_typeScript_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    let SearchQuery = class SearchQuery {
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
        constructor() {
            this._searchRequest = {
                size: 10
            };
        }
        get searchQuery() { return JSON.stringify(this._searchRequest); }
        get size() { return this._searchRequest.size || 0; }
        set size(size) { this._searchRequest.size = size; }
        get offset() { return this._searchRequest.offset || 0; }
        set offset(size) { this._searchRequest.offset = size; }
        /**
         *
         * @param searchString
         */
        quicksearch(searchString) {
            let searchParam = {};
            searchParam.size = this.size;
            searchParam.query = {
                "$type": "QueryStringQuery",
                "field": "_quicksearch",
                "queryString": `${searchString}*`
            };
            this._searchRequest = searchParam;
        }
        suggestion(searchString, lastTerm) {
            let searchParam = {};
            if (lastTerm) {
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
        }
    };
    SearchQuery = __decorate([
        taktik_polymer_typeScript_1.jsElement()
    ], SearchQuery);
    exports.SearchQuery = SearchQuery;
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
    let SearchGenerator = class SearchGenerator {
        constructor(url, searchParam, ozoneAccess) {
            this.offset = 0;
            this.done = false;
            this.searchParam = searchParam;
            this.url = url;
            this.ozoneAccess = ozoneAccess;
        }
        /**
         * load next array of results
         * @return {Promise<SearchResult>}
         */
        next() {
            this.searchParam.offset = this.offset;
            return this._postRequest(this.url, this.searchParam.searchQuery, this._readSearchResponse);
        }
        _postRequest(url, body, responseFilter) {
            this.ozoneAccess.url = url;
            this.ozoneAccess.method = 'POST';
            this.ozoneAccess.body = body;
            return this.ozoneAccess
                .generateRequest().completes.then(responseFilter.bind(this));
        }
        _readSearchResponse(res) {
            this.total = Number(res.response.total);
            this.offset += Number(res.response.size);
            this.done = this.offset < this.total;
            let results = res.response.results || [];
            return {
                results,
                total: this.total
            };
        }
    };
    SearchGenerator = __decorate([
        taktik_polymer_typeScript_1.jsElement(),
        __metadata("design:paramtypes", [String, SearchQuery, Object])
    ], SearchGenerator);
    exports.SearchGenerator = SearchGenerator;
});
