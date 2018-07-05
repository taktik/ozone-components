
import "polymer/polymer-element.html"

import "paper-listbox/paper-listbox.html"
import "paper-input/paper-input.html"
import "paper-input/paper-input-container.html"
import "paper-item/paper-item.html"
import "paper-button/paper-button.html"
import "paper-icon-button/paper-icon-button.html"
import "font-roboto/roboto.html"

import "iron-icons/iron-icons.html"
import "iron-flex-layout/iron-flex-layout.html"
import "iron-flex-layout/iron-flex-layout-classes.html"
import "iron-collapse/iron-collapse.html"

import {property, customElement} from 'taktik-polymer-typescript'

import './taktik-free-text-search.html'

@customElement( 'taktik-free-text-search')
export class TaktikFreeTextSearch extends Polymer.Element {


    /**
     * Value of the search query
     */
    @property({
        type: String,
        notify: true,
        observer:'searchValueChange'
    })
    searchValue?: string;
    /**
     * Array of search result.
     */
    @property({
        type: Array,
        notify: true,
        //readOnly: true
    })
    searchResults: Array<any> = [];
    /**
     * Array of suggestions
     */
    @property({type: Array,})
    suggestions:Array<any> = [];
    /**
     * display number of suggestion find
     */
    @property({type: Boolean})
    showItemCount: boolean = false;

    /**
     * Disable search input
     */
    @property({type: Boolean, observer:'_disabledChange'})
    disabled: boolean = false;

    /**
     * name of the iron-icon to diplay for search. Default value is "icons:search"
     * @type {string}
     */
    @property({type: String})
    iconSearch: string = "icons:search";

    @property({
        type: Boolean,
        notify: true
    })
    _isInputFocus: boolean = false

    $:{
        clear: HTMLElement
    } | any;

    ready (){
        super.ready();

        this.$.searchInput.addEventListener("keydown", (e: Event) => this._keyType(e as KeyboardEvent));
        this.$.searchInput.addEventListener("blur", () => this._formBlur());
        this.$.searchInput.addEventListener("focus", () => this._formFocus());
        this.$.searchInput.addEventListener("tap", () => this._formFocus());
        this._disabledChange(this.disabled);
    }

    static get observers() {
        return [
            '_displayAutoComplete(suggestions, _isInputFocus)'
        ];
    }
    /**
     * Fired when the search is submitted.
     * The value of the search query can be found in the detail.
     *
     * @event taktik-search
     */


    _keyType (keypress: KeyboardEvent) {
        if( keypress.key === 'Enter' || keypress.keyCode === 13){
            this._pressEnter();

        } else if (keypress.key === 'ArrowDown' || keypress.keyCode === 40) {
            this._pressArrowDown();

        } else if (keypress.key === 'ArrowUp'|| keypress.keyCode === 38) {
            this._pressArrowUp();

        } else if (keypress.key === 'Space'|| keypress.keyCode === 32) {
            this._appendSelectedItemToSearch();

        } else if (keypress.key === 'Escape'|| keypress.keyCode === 27) {
            this._pressEscape();

        } else {
            // on any other key press the highlight on the auto completion list
            // should be remove.
            this.$.listBox.select();
        }
    }

    _isSuggestionHighlight () {
        return ( !isNaN(this.$.listBox.selected) && !(this.$.listBox.selected == undefined));
    }

    _pressEnter (){
        this._appendSelectedItemToSearch();
        this.fireTaktikSearch();
        this.$.collapseAutoComplete.hide()
    }

    private _lastFire=0;
    private _throttleDelayOnfire = 500;
    fireTaktikSearch() {
        const now = (new Date).getTime();
        if (now - this._lastFire < this._throttleDelayOnfire) {
            return;
        }
        this._lastFire = now;
        this.dispatchEvent(new CustomEvent('taktik-search', {
            bubbles: true, composed: true,
            detail: this.searchValue
        } as CustomEventInit));
    }

    _pressArrowDown (){
        // highlight next or first item the the auto completion list
        if (! this._isSuggestionHighlight()){
            this.$.listBox.selected = 0;
        } else {
            this.$.listBox.selectNext();
        }
    }

    _pressArrowUp (){
        // highlight previous or last item the the auto completion list
        if (! this._isSuggestionHighlight()){
            this.$.listBox.selected = this.suggestions.length - 1;
        } else {
            this.$.listBox.selectPrevious();
        }
    }
    _pressEscape (){
        // Remove focus from the search input
        this.$.container.focus();
        this.$.collapseAutoComplete.hide()
    }

    _searchTap () {
        this._appendSelectedItemToSearch();
        this.fireTaktikSearch();
    }

    _selectItem (event: any){
        let searchValue = event.model.item.key;
        this.set('searchValue', searchValue);
        this.fireTaktikSearch();
    }

    _formBlur () {
        this.set('_isInputFocus', false);
    }

    _formFocus (){
        this.set('_isInputFocus', true);
    }

    _displayAutoComplete (suggestions?: string, isFocus?: boolean){
        let element = this.$.collapseAutoComplete;
        if(isFocus && suggestions && suggestions.length > 0){
            element.show();
        } else if(! isFocus){
            if (element) {
                setTimeout(element.hide.bind(element), 150); // Give a chance to select an auto-complete result
            }
        }
    }

    _appendSelectedItemToSearch (){
        if (this._isSuggestionHighlight() && typeof this.searchValue !== 'undefined') {
            let selectedItem = this.suggestions[this.$.listBox.selected].key;
            let serachArray = this.searchValue
                .split(' ') // array of words
                .filter(Boolean); // remove empty string

            serachArray.splice(-1, 1, selectedItem); // replace last typed letters by suggestion
            this.set('searchValue', serachArray.join(' '));  // Convert to string

            this.$.listBox.select(); //remove auto-complete selection
        }
    }

    _clear(){
        this.set("searchValue", "");
    }
    searchValueChange(){
        if(typeof this.searchValue !== "undefined" && this.searchValue.length > 0){
            this.$.clear.classList.remove('hidden')
        } else {
            this.$.clear.classList.add('hidden')
        }
    }

    _disabledChange(disabled?: boolean){
        if(disabled){
            this.$.searchInput.classList.add('disabled')
        } else{
            this.$.searchInput.classList.remove('disabled')
        }
    }
}
