/**
 * Created by hubert on 8/06/17.
 */

import "polymer/polymer-element.html"
import "iron-flex-layout/iron-flex-layout.html"
import "ozone-item-preview"
import "ozone-api-item"
import "ozone-collection"

import "./ozone-mosaic.html"
import 'ozone-iron-list'
import {OzoneIronList} from 'ozone-iron-list'

import {customElement, domElement, property} from 'taktik-polymer-typescript';
import {Item, SearchRequest} from 'ozone-type';
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
 *  `--ozone-mosaic-item`  | css mixin for the list of item | `{ box-sizing: border-box;width:300px;height:200px;margin:10px;display:flex;overflow: hidden;}`
 *
 */
@customElement('ozone-mosaic')
export class OzoneMosaic  extends Polymer.Element implements  TaktikSearchApiBehavior{

    @domElement()
    $: {
        resultList: HTMLElement
        ironList: OzoneIronList;
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
        this.$.ironList.$.mosaicCollection.set('collection', collectionType);
    }

    private clearTriggers(){
        this._scrollTrigger = false

    }

    ready(){
        super.ready();

        this.$.ironList
            .addEventListener('collection-property-changed', (event:Event) => {
                this.set((event as CustomEvent).detail.name, (event as CustomEvent).detail.value)
            })
    }
    /**
     * trigger quickSearch in the collection
     * @param searchString
     */
    searchInItems(searchString?:string){
        if(typeof(searchString) !== 'undefined'){
            this.set('searchResults', []);
            return this.$.ironList.$.mosaicCollection.quickSearch(searchString, this.searchSize);
        }
        return Promise.reject('Undefined search String')
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
            return this.$.ironList.$.mosaicCollection.saveOne(updatedData).then((index:number)=>{
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
        return this.search(searchQuery)
    }

    /**
     * start search query
     * @param {SearchQuery} searchRequest
     * @return {Promise<Array<Item>>}
     */
    search(searchRequest: SearchQuery){
        return this.$.ironList.$.mosaicCollection.search(searchRequest)
    }

    /**
     * empty collection
     */
    clear(){
        return this.$.ironList.clear()
    }
}