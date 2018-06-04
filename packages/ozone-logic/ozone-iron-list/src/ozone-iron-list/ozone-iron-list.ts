/**
 * Created by hubert on 8/06/17.
 */

import "polymer/polymer-element.html"
import "../iron-list/iron-list.html"
import "iron-flex-layout/iron-flex-layout.html"
import "ozone-collection"

import "./ozone-iron-list.html"

import {customElement,} from 'taktik-polymer-typescript';
import {Item} from 'ozone-type';
import {OzoneCollection} from 'ozone-collection';
import {SearchQuery} from "ozone-search-helper";
import {property} from "taktik-polymer-typescript";



/**
 * <ozone-iron-list> is an iron-list composed of an ozone-connection.
 *
 * ```html
 *         <style>
 *             #scrollTheshold {
 *              height: 70vh; // container has to be a fix size see https://github.com/PolymerElements/iron-list#sizing-iron-list
 *              overflow-y: scroll;
 *             }
 *         </style>
 *         <div id="scrollTheshold">
 *           <ozone-iron-list
 *             id="ironList"
 *             items="{{searchResults}}"
 *             grid
 *             selection-enabled
 *             scroll-target="scrollTheshold">
 *             <template>
 *                 <div class="item">
 *                     <ozone-item-preview class="photoContent"
 *                      item-id="[[item.id]]"
 *                      item-data="[[item]]"
 *                      class="resultListItem"
 *                      selected="[[selected]]"
 *                     ></ozone-item-preview>
 *                     <ozone-item-action
 *                      class="actionPanel"
 *                      selected="[[selected]]" item-data="[[item]]">npo</ozone-item-action>
 *                     </div>
 *             </template>
 *           </ozone-iron-list>
 *         </div>
 * ```
 * ``` javascript
 * const myQuery = new SearchQuery()
 * // configure search query
 * this.$.ironList.search(myQuery)
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
export declare class IronList extends PolymerElement{
    scrollTarget?: PolymerElement;
    notifyResize(): void;
}

@customElement('ozone-iron-list')
export class OzoneIronList  extends Polymer.ElementMixin<IronList>(IronList){

    $: {
        selector: HTMLElement
        mosaicCollection: OzoneCollection;
        items: PolymerElement;
    } | any;

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
    hasMoreData: boolean = false;

    @property({
        type: Array,
        notify:true,
    })
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
        });
        this.$.mosaicCollection.addEventListener('collection-property-changed', (e: Event) => {
            this.set((e as CustomEvent).detail.name, (e as CustomEvent).detail.value)
        });
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
        if(this.scrollTarget){
            return (this.scrollTarget.clientHeight + this.scrollTarget.scrollTop) / this.scrollTarget.scrollHeight * 100;
        } else {
            return 0;
        }
    }

    /**
     * Load more items to display
     */
    loadMoreItems(){
        return this.$.mosaicCollection.loadNextItems()
    }

    private toggleThreshold(){
        if(this.hasMoreData) {
            return this.loadMoreItems()
                .catch(() => {
                })
                .then(() => {
                    this.clearTriggers();
                    // workaround to enable infinit scroll, othervise it does not display all the list.
                    // Needed only once.
                    // TODO improve component to avoid this call
                    this.notifyResize()
                });
        }
        this.clearTriggers();
        return Promise.resolve();
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
