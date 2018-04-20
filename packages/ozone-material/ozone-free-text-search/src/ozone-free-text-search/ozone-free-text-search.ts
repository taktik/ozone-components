import "paper-listbox/paper-listbox.html"
import "paper-input/paper-input.html"
import "paper-item/paper-item.html"
import "paper-button/paper-button.html"
import "paper-material/paper-material.html"

import "iron-icons/iron-icons.html"
import "iron-flex-layout/iron-flex-layout.html"
import "iron-flex-layout/iron-flex-layout-classes.html"
import "iron-collapse/iron-collapse.html"

import "../ozone-api-search/ozone-api-search.html"
import "../taktik-free-text-search/taktik-free-text-search.html"
import {property, customElement} from 'taktik-polymer-typescript'
import './ozone-free-text-search.html'
import {TaktikFreeTextSearch} from '../taktik-free-text-search/taktik-free-text-search'
import {OzoneApiSearch} from '../ozone-api-search/ozone-api-search'


@customElement('ozone-free-text-search')
export class OzoneFreeTextSearch extends Polymer.Element {

    /**
     * Value of the search query
     */
    @property({type: String, notify: true})
    searchValue?: string;
    /**
     * Array of search result.
     */
    @property({
        type: Array,
        notify: true,
        observer: '_resultsFound'
    })
    searchResults: Array<any> = [];
    /**
     * display number of suggestion find
     */
    @property({type: Boolean})
    showItemCount:  boolean = false;

    ready() {
        super.ready();
        this.$.freeTextSearch.registerAutoCompleteAPI(this.$.ozoneAutoComplete);
        this.$.freeTextSearch.registerSearchAPI(this.$.ozoneSearchItem)
    }
}