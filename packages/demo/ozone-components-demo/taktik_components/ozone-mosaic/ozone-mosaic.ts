/**
 * Created by hubert on 8/06/17.
 */

/// <amd-module name="ozone-mosaic"/>

import "polymer/polymer-element.html"
import "iron-list/iron-list.html"
//import "iron-scroll-threshold/iron-scroll-threshold.html"
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
     * If true, automatically performs an Ajax request when either *searchString*, *itemType* or *size* changes.
     */
    auto:boolean;

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
 */
@customElement('ozone-mosaic')
export class OzoneMosaic  extends Polymer.Element implements  TaktikSearchApiBehavior{

    @domElement()
    $: {
        scrollTheshold:{
            clearTriggers():void
        }
        mosaicCollection: OzoneCollection;
        ironList: PolymerElement;
    };
    /**
     * id of the source
     */
    searchResults: Array<Item>;

    /**
     * string to search in the collection
     */
    searchString:string;

    /**
     * total number of items found with the search
     */
    total: number;

    /**
     * true indicate that all the data data still available with this search.
     */
    dataRemain: boolean;

    /**
     * unused in this implementation
     */
    auto: boolean;

    /**
     * type of the collection
     */
    collectionType: string;

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

    ready(){
        super.ready();

        this.$.ironList.addEventListener('delete-item', (event: CustomEvent) => {
            console.log('delete-item')
            this.$.mosaicCollection.deleteOne(event.detail.id)
        })
    }

    /**
     * trigger quickSearch in the collection
     * @param searchString
     */
    searchInItems(searchString:string){
        this.set('searchResults', []);
        this.$.mosaicCollection.quickSearch(searchString, 50);
    }

    /**
     *
     */
    toggleThreshold(){
        this.$.mosaicCollection.loadNextItems()
            .catch(()=>{})
            .then(()=>{
                this.$.scrollTheshold.clearTriggers();
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