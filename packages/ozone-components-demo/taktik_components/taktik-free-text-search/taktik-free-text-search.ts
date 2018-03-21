/**
*
* `taktik-free-text-search` is a horizontal free text taktik-search bar to any content.
*     The search api has to be set using ‘‘ and ‘‘
*
*
* Example:
*
*     ```html
*     <paper-material elevation="1">
*       <style is="custom-style">
*         .customStyle {
*           --taktik-search-button: {
*             background-color: sienna;
*             color: white;
*           };
*           --taktik-auto-complete-items: {
*             font-family: serif;
*           };
*           --taktik-count-result-found:{
*             color: darkgrey;
*           }
*           --taktik-input-color: {
*             --paper-input-container-focus-color: #2C2958;
*           }
*         }
*       </style>
*       <taktik-free-text-search
*         id="taktikFreeTextSearch"
*         class="customStyle "
*         search-value="{{search}}"
*         show-item-count
*         search-results="{{result}}">
*         </taktik-free-text-search>
*
*       found {{result.length}} results with "{{search}}".
*     </paper-material>
*     <script>
*     ...
*         taktikFreeTextSearch.registerAutoCompleteAPI(autoCompleteAPI);
*         taktikFreeTextSearch.registerSearchAPI(searchAPI);
*     </script>
* ```
*
* ### Events
*  * *taktik-search* Fired when the search is submitted. The value of the search query can be found in the detail.
*
* ### Styling
*
* The following custom properties and mixins are available for styling:
*
* Custom property | Description | Default
* ----------------|-------------|----------
*     `--taktik-search-button` | css mixin for the search button | `{}`
*     `--taktik-auto-complete-items` | css mixin auto complete paper-items | `{}`
*     `--taktik-count-result-found` | css mixin for the number of result found | `{}`
*     `--taktik-input-color` | css mixin for the color of the input | `{--paper-input-container-focus-color: #2C2958;}`
*     `--taktik-listBox` | css mixin for the list box style | `{}`
*
**/
declare class TaktikFreeTextSearch extends Polymer.Element{
    /**
     * Value of the search query
     */
    searchValue: string;

    /**
     * Array of search result.
     */
    searchResults: string;

    /**
     * Array of suggestions
     */
    suggestions: Array<any>

    /**
     * if true, display number of suggestion find
     */
    showItemCount: boolean;

    /**
     * register api to be used for auto completion.
     * autoCompleteAPI should be an implementation of *Taktik-search-api-behavior*
     * @param   {TaktikSearchApiBehavior}   autoCompleteAPI
     */
    registerAutoCompleteAPI (autoCompleteAPI: Element): void;

    /**
     * register api to be used for search.
     * searchAPI should be an implementation of *Taktik-search-api-behavior*
     * @param  {TaktikSearchApiBehavior}  searchAPI
     */
    registerSearchAPI (searchAPI: Element): void;
}