# ozone-iron-list

Implementation of an iron-list to display an ozone search result with lazy loading.

## documentation

 <ozone-iron-list> is an iron-list composed of an ozone-connection.

 ```html
         <div >
           <ozone-iron-list
             id="ironList"
             items="{{searchResults}}"
             grid
             selection-enabled
             scroll-target="scrollTheshold">
             <template>
                 <div class="item">
                     <ozone-item-preview class="photoContent"
                      item-id="[[item.id]]"
                      item-data="[[item]]"
                      class="resultListItem"
                      selected="[[selected]]"
                     ></ozone-item-preview>
                     <ozone-item-action
                      class="actionPanel"
                      selected="[[selected]]" item-data="[[item]]">npo</ozone-item-action>
                     </div>
             </template>
           </ozone-iron-list>
         </div>
 ```
 ``` javascript
 const myQuery = new SearchQuery()
 // configure search query
 this.$.ironList.search(myQuery)
 ```
 expose $.mosaicCollection for operation on the collection

## Implements

Inherit from from  *iron-list*

  ### Mixin
  Custom property | Description | Default
  ----------------|-------------|----------
  `--ozone-list-loader`  | css mixin for loader element | `{ background-color: #585185; color: white; position:relative; bottom:0; left:0; right:0; text-align: center; height: 44px; font-family:'Roboto', sans-serif; font-size: 13px; line-height: 44px; margin:0 -10px -10px;}`




## command

`npm install`: install project dependency.

`npm run tsc`: run typeScript compiler.

`npm run build` build application.

`npm run test` bundle test files with webpack and run test with webComponent tester.

`npm run build:watch` bundle test files with webpack and watch on changes.

`npm run test:persist` bundle test files with webpack and watch on changes.

`npm run doc` generate project documentation with typedoc.
