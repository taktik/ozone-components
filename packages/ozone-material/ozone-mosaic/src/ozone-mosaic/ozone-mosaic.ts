/**
 * Created by hubert on 8/06/17.
 */

import "polymer/polymer-element.html"
import "iron-list/iron-list.html"
import "paper-item/paper-item.html"
import "paper-button/paper-button.html"
import "iron-flex-layout/iron-flex-layout.html"
import "ozone-item-preview"
import "ozone-api-item"
import "ozone-collection"

import "./ozone-mosaic.html"

import {customElement, domElement, property} from 'taktik-polymer-typescript';
import {Item, SearchRequest} from 'ozone-type';
import {OzoneCollection} from 'ozone-collection';
import {SearchQuery} from "ozone-search-helper";


/**
 * `TaktikSearchApiBehavior` defines standard behavior for search modules compatible with *taktik-free-text-search*.
 *
 * @polymerMixin
 */

export interface TaktikSearchApiBehavior{
    /**
     * searchString string for search query.
     */
    searchString: string;
    /**
     * Array of search results
     */
    searchResults: Array<any>;

    /**
     * Fired when results are found by the API.
     *
     * @event results-found
     */
}
/**
 * <ozone-mosaic> is an element that display ozone items in a mosaic view.
 *
 * ```html
 * <ozone-mosaic item-data={{item}}>  </ozone-mosaic>
 * ```
 *
 *  ### Events
 *
 * * *results-found* Fired when results are found by the API.
 *
 * ### Implements
 *
 *  *TaktikSearchApiBehavior*
 *
 *  ### Mixin
 *  Custom property | Description | Default
 *  ----------------|-------------|----------
 *  `--ozone-mosaic-loader`  | css mixin for loader element | `{ background-color: #585185; color: white; position:relative; bottom:0; left:0; right:0; text-align: center; height: 44px; font-family:'Roboto', sans-serif; font-size: 13px; line-height: 44px; margin:0 -10px -10px;}`
 *  `--ozone-mosaic-list`  | css mixin for the list of item | `{ width:100%; height: 80vh;}`
 *
 */
@customElement('ozone-mosaic')
export class OzoneMosaic  extends Polymer.Element implements  TaktikSearchApiBehavior{

    @domElement()
    $: {
        resultList: HTMLElement
        mosaicCollection: OzoneCollection;
        ironList: PolymerElement;
    } | any;
    /**
     * id of the source
     */
    @property({
        type: Array,
        notify: true,
    })
    searchResults: Array<Item> = [];

    /**
     * string to search in the collection
     */
    @property({type: String})
    searchString:string = '';

    /**
     * total number of items found with the search
     */
    @property({
        type: Number,
        notify:true,
    })
    total?: number;

    /**
     * true indicate that all the data data still available with this search.
     */
    @property({
        type: Boolean,
        notify:true,
    })
    dataRemain: boolean = false;

    /**
     * Define size of query result
     * @type {number}
     */
    @property({type:Number})
    searchSize = 50;

    /**
     * type of the collection
     */
    @property({
        type: String,
        observer: '_collectionTypeChange',
    })
    collectionType: string = 'item';

    private _scrollTrigger = false;
    /**
     * scrollthreshold in percent to trigger loading of more items
     * @type {number}
     */
    @property({type:Number})
    scrollthresholdPc = 80;

    private _collectionTypeChange(collectionType: string){
        this.$.mosaicCollection.set('collection', collectionType);
    }

    private clearTriggers(){
        this._scrollTrigger = false
    }

    ready(){
        super.ready();
        this.$.ironList.addEventListener('delete-item', (event: CustomEvent) => {
            console.log('delete-item')
            this.$.mosaicCollection.deleteOne(event.detail.id)
        });
        this.$.resultList.addEventListener("scroll", (event: Event) => {
            this._checkScroll();
        })
        //Periodic verification because no scroll event is trigger when nb of items display does not overflow display size
        setInterval(() => {
            this._checkScroll();
        }, 100)
    }

    private _checkScroll() {
        const percentage = this.getScrollPercentage()
        if (percentage > this.scrollthresholdPc && !this._scrollTrigger) {
            this._scrollTrigger = true;
            this.toggleThreshold()
        }
    }

    private getScrollPercentage(){
        return ((this.$.resultList.clientHeight + this.$.resultList.scrollTop) / this.$.resultList.scrollHeight) * 100
    }

    /**
     * trigger quickSearch in the collection
     * @param searchString
     */
    searchInItems(searchString?:string){
        if(typeof(searchString) !== 'undefined'){
            this.set('searchResults', []);
            return this.$.mosaicCollection.quickSearch(searchString, this.searchSize);
        }
        return Promise.reject('Undefined search String')
    }

    /**
     * Load more items to display
     */
    loadMoreItems(){
        return this.$.mosaicCollection.loadNextItems()
    }

    private toggleThreshold(){
        return this.loadMoreItems()
            .catch(()=>{})
            .then(()=>{
                this.clearTriggers();
            });
    }

    /**
     * start a new search base on -searchString-.
     */
    requestSearch(){
        this.searchInItems(this.searchString);
    }

    /**
     * Save given item.
     * @param {Item} updatedData
     * @return {Promise<Item>}
     */
    saveSelectedItem(updatedData?:Item):Promise<Item>{
        if(updatedData){
            return this.$.mosaicCollection.saveOne(updatedData).then((index:number)=>{
                return this.searchResults[index];
            });
        } else{
            return Promise.reject('updatedData is null')
        }
    }

    /**
     * perform a custom search
     * @param {SearchRequest} requestQuery
     * @return {Promise<Array<Item>>}
     */
    customSearchQuery(requestQuery: SearchRequest){
        const searchQuery: SearchQuery = new SearchQuery();
        searchQuery.custom(requestQuery)
        return this.$.mosaicCollection.search(searchQuery)
    }
}