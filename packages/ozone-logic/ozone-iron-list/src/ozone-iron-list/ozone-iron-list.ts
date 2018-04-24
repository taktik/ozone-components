/**
 * Created by hubert on 8/06/17.
 */

import "polymer/polymer-element.html"
import "iron-list/iron-list.html"
import "iron-flex-layout/iron-flex-layout.html"
import "ozone-collection"

import "./ozone-iron-list.html"

import {customElement,} from 'taktik-polymer-typescript';
import {Item} from 'ozone-type';
import {OzoneCollection} from 'ozone-collection';
import {SearchQuery} from "ozone-search-helper";



/**
 * <ozone-iron-list> is an iron-list composed of an ozone-connection.
 *
 * ```html
 * <ozone-mosaic item-data={{item}}>  </ozone-mosaic>
 * ```
 * expose $.mosaicCollection for operation on the collection
 *
 * ### Implements
 *
 *  *iron-list*
 *
 *  ### Mixin
 *  Custom property | Description | Default
 *  ----------------|-------------|----------
 *  `--ozone-list-loader`  | css mixin for loader element | `{ background-color: #585185; color: white; position:relative; bottom:0; left:0; right:0; text-align: center; height: 44px; font-family:'Roboto', sans-serif; font-size: 13px; line-height: 44px; margin:0 -10px -10px;}`
 *
 */
declare class IronList extends PolymerElement{}

@customElement('ozone-iron-list')
export class OzoneIronList  extends Polymer.ElementMixin<PolymerElement>(IronList){

    $: {
        selector: HTMLElement
        mosaicCollection: OzoneCollection;
        items: PolymerElement;
    } | any;



    items: Array<Item> = [];


    // static get properties(){
    //     return {
    //         scrollthresholdPc:{
    //             type: Number
    //         }
    //     }
    // }
    private _scrollTrigger = false;
    /**
     * scrollthreshold in percent to trigger loading of more items
     * @type {number}
     */
    scrollthresholdPc = 80;


    private clearTriggers(){
        this._scrollTrigger = false
    }

    ready(){
        super.ready();
        this.addEventListener("scroll", (event: Event) => {
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
        return (this.clientHeight + this.scrollTop) / this.scrollHeight * 100;
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
     * start search query
     * short hand for this.$.mosaicCollection.search
     * @param {SearchQuery} searchRequest
     * @return {Promise<Array<Item>>}
     */
    search(searchRequest: SearchQuery){
        return this.$.mosaicCollection.search(searchRequest)
    }

    /**
     * empty collection
     */
    clear(){
        return this.$.mosaicCollection.clear()
    }
}
