
import "polymer/polymer-element.html"
import "iron-ajax/iron-ajax.html"

import {OzoneConfig, ConfigType} from 'ozone-config'
import {property, customElement} from 'taktik-polymer-typescript'
import './ozone-api-search.html'

@customElement('ozone-api-search')
export class OzoneApiSearch extends Polymer.Element {

    /**
     * Ozone Config property
     */
    config?: ConfigType;

    /**
     * Service URL to be used by each ozone-api instance.
     * Its value is automatically set by computeServiceUrl method.
     */
    serviceUrl?: string
    /**
     * If true, it will suggest result for a *suggest* function.
     *
     * In suggest mode, *searchResults* is an array of aggregations object (key, docCount).
     * Otherwise it is a list of search items
     */
    @property({type: Boolean})
    suggest: boolean = false;

    /**
     * If true, automatically performs an Ajax request when either *searchString*, *itemType* or *size* changes.
     */
    @property( {type: Boolean})
    auto: boolean = true;

    /**
     * Type of items search.
     * Default value search in all types
     */
    @property({type: String})
    itemType: string = 'item';

    /**
     * Max size of searchResults list.
     */
    @property({type: Number})
    size: number = 10;

    _searchEndPoint?: string;

    _searchParam: any;
    /**
     * searchString string for search query.
     */
    @property({type: String})
    searchString?: string;
    /**
     * Array of search results
     */

    @property({
        type: Array,
        notify: true,
        observer: '_resultsFound'
    })
    searchResults: Array<any> = [];

    ready (){
        super.ready();
        this.addEventListener("ozone-api-request-success", (e: Event) => {this._handle_response(e)});
        this._getConfig();
        this.$.ozoneAccess.addEventListener('response', (e: Event) => this._ozoneResponse(e as CustomEvent));
        this.$.ozoneAccess.addEventListener('error', (e: Event) => this._ozoneError(e as CustomEvent));
    }

    static get observers() {
        return [
            'computeServiceUrl(config.endPoints.items)', // OzoneApiAjaxBehavior
            '_computeSearchEndPoint(serviceUrl, itemType)',
            '_computeSearchParam(searchString, suggest, size)'
        ];
    }


    /**
     * Fired when connection to ozone succeeds.
     *
     * @event ozone-api-request-success
     */

    /**
     * Fired when connection to ozone fails.
     * Event detail contains status and statusText.
     *
     * @event ozone-api-request-error
     */

    /**
     * Compute url of each service.
     * This method is foreseen to be called in the observers
     * Example:
     *       `observers: ['computeServiceUrl(config.endPoints.login)'],`
     * @param ozoneEndPoint (String) Api end point as define in the config file.
     */
    computeServiceUrl(ozoneEndPoint: string) {
        this.serviceUrl = this.getServiceUrlFromEndpoint(ozoneEndPoint);
    }

    getServiceUrlFromEndpoint(ozoneEndPoint: string){
        if(this.config)
            return this.config.host + ozoneEndPoint
        return ozoneEndPoint

    }

    /**
     *
     * @private
     */
    _getConfig() {
        OzoneConfig.get().then((config) => {
            this.config = config;
        });
    }

    _ozoneResponse(event: CustomEvent) {
        this.dispatchEvent(new CustomEvent('ozone-api-request-success',
            {bubbles: true, composed: true, detail: event.detail} as CustomEventInit));
    }

    _ozoneError(response: CustomEvent) {
        // Notify everyone
        this.dispatchEvent(new CustomEvent('ozone-api-request-error', {
            bubbles: true, composed: true,
            detail: {
                status: response.detail.request.status,
                statusText: response.detail.request.statusText
            }
        }as CustomEventInit));
    }
    /**
     * Submit ozone search query
     */
    requestSearch () {
        this.$.ozoneAccess.generateRequest();
    }

    _handle_response (e: Event) {
        let response = this.$.ozoneAccess.lastResponse;
        if(response) {
            if (response.hasOwnProperty('aggregations')) {
                let result = response.aggregations[0].buckets;
                this.searchResults = result;
                this.notifyPath('searchResults')
            } else {
                let result = response.results;
                this.searchResults = result;
                this.notifyPath('searchResults')
            }
        }
    }

    _computeSearchEndPoint (serviceUrl: string, itemType: string) {
        if (serviceUrl) {
            this.set('_searchEndPoint', `${serviceUrl}/${itemType}/search`);
        }
    }

    _computeSearchParam (searchString: string | undefined, suggest: boolean, size: number){
        searchString = searchString ? searchString : ''; // replace undefined by empty string
        let allTerms = searchString.split(' ');
        let lastTerm = allTerms[allTerms.length-1];

        let searchParam: any = {};

        if (suggest) {
            searchParam["aggregations"] = [{
                "$type": "TermsAggregation",
                "name": "suggest",
                "field": "_quicksearch",
                "order": "COUNT_DESC",
                "size": size,
                "includePattern": `${lastTerm}.*`
            }];
            searchParam["size"] = 0;
            searchParam["query"] = {
                "$type": "QueryStringQuery",
                "field": "_quicksearch",
                "queryString": `${searchString}*`
            };
        } else {
            searchParam["size"] = size;
            searchParam["query"] = {
                "$type": "QueryStringQuery",
                "field": "_quicksearch",
                "queryString": `${searchString}*`
            };
        }
        this.set('_searchParam', JSON.stringify(searchParam));
    }

    configReady() {
        // compute search param at least one time.
        this._computeSearchParam(this.searchString, this.suggest, this.size);
    }
    /**
     * Fired when results are found by the API.
     *
     * @event results-found
     */
    _resultsFound (results: Array<any>){
        this.dispatchEvent(new CustomEvent('results-found',
            {
                bubbles: true,
                composed: true,
                detail: results
            } as CustomEventInit));
    }
}
