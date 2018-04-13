/**
 * Created by hubert on 8/06/17.
 */

/// <amd-module name="ozone-mosaic"/>

import "polymer/polymer-element.html"
import "iron-list/iron-list.html"
import "paper-item/paper-item.html"
import "paper-button/paper-button.html"
import "iron-flex-layout/iron-flex-layout.html"
import "ozone-item-preview"
import "ozone-api-item"
import "ozone-collection"

import "./ozone-mosaic.html"

import {customElement, domElement} from 'taktik-polymer-typescript';
import {Item} from 'ozone-type';
import {OzoneCollection} from 'ozone-collection';


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
    searchResults: Array<Item> = [];

    /**
     * string to search in the collection
     */
    searchString:string = '';

    /**
     * total number of items found with the search
     */
    total?: number;

    /**
     * true indicate that all the data data still available with this search.
     */
    dataRemain: boolean = false;

    /**
     * type of the collection
     */
    collectionType: string = 'item';

    private _scrollTrigger = false;
    private scrollthreshold = 600;

    private _collectionTypeChange(collectionType: string){
        this.$.mosaicCollection.set('collection', collectionType);
    }


    static get properties() {
        return {
            searchResults: {
                type: Array,
                notify: true,
                value: () =>  []
            },
            searchString: {
                type: String
            },
            selectedAction: {
                type: Number,
                value: 0,
            },
            total: {
                type: Number,
                notify:true
            },
            dataRemain:{
                type: Boolean,
                notify:true,
                value: false
            },
            collectionType:{
                type: String,
                value: 'item',
                observer: '_collectionTypeChange',
            },
        }
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
            if(this.$.resultList.scrollTop  > this.scrollthreshold && ! this._scrollTrigger){
                console.log('scroll')
                this._scrollTrigger = true;
                this.toggleThreshold()
            }
        })
    }

    /**
     * trigger quickSearch in the collection
     * @param searchString
     */
    searchInItems(searchString?:string){
        if(searchString){
        this.set('searchResults', []);
        this.$.mosaicCollection.quickSearch(searchString, 50);
        }
    }

    /**
     *
     */
    toggleThreshold(){
        this.$.mosaicCollection.loadNextItems()
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
}