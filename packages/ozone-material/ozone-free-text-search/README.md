[![NPM version][npm-image]][npm-url]

# \<ozone-free-text-search\>

Material design for free text search box.

## install

 ```
 $ npm install --save ozone-free-text-search
 ```

## usage 

`taktik-free-text-search` is a horizontal free text taktik-search bar to any content.
The search api has to be set using metods‘registerAutoCompleteAPI‘ and ‘registerSearchAPI‘


Example:

```html
    <paper-material elevation="1">
      <style is="custom-style">
        .customStyle {
          --taktik-search-button: {
            background-color: sienna;
            color: white;
          };
          --taktik-auto-complete-items: {
            font-family: serif;
          };
          --taktik-count-result-found:{
            color: darkgrey;
          }
          --taktik-input-color: {
            --paper-input-container-focus-color: #2C2958;
          }
        }
      </style>
      <taktik-free-text-search
        id="taktikFreeTextSearch"
        class="customStyle "
        search-value="{{search}}"
        show-item-count
        suggestions="{{autoCompleteResults}}"
        search-results="{{result}}">
        </taktik-free-text-search>

      found {{result.length}} results with "{{search}}".
    </paper-material>
    <script>
    ...
        this.$.taktikFreeTextSearch.taktikFreeTextSearch('taktik-search', (event) => {
            console.log('Search string: ', event.detail)
        });
    ... 
        @observer('search')
        async _searchChange(searchString){
            const searchQuery = new SearchQuery()
            searchQuery
                .quicksearch(this.search)
                .setSize(5)
                .suggestion(searchString, lastTerm, 5);
            const autoComplete = await this.itemClient.search(searchQuery.searchRequest)
            this.set('autoCompleteResults', autoComplete.results)
        }

    </script>
```

## Events

*taktik-search*: Fired when the search is submitted. The value of the search query can be found in the detail.


## Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--taktik-search-button` | css mixin for the search button | `{}`
`--taktik-auto-complete-items` | css mixin auto complete paper-items | `{}`
`--taktik-count-result-found` | css mixin for the number of result found | `{}`
`--taktik-input-color` | css mixin for the color of the input | `{--paper-input-container-focus-color: #2C2958;}`
`--taktik-listBox` | css mixin for the list box style | `{}`
`--taktik-search-disable` | css mixin when search is disable | `{}`


[npm-image]: https://badge.fury.io/js/ozone-free-text-search.svg
[npm-url]: https://npmjs.org/package/ozone-free-text-search
