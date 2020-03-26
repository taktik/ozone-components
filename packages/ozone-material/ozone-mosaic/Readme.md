[![NPM version][npm-image]][npm-url] 
# ozone-mosaic

<ozone-mosaic> is an element that display ozone items in a mosaic view.

```html
<ozone-mosaic item-data={{item}}>  </ozone-mosaic>
```

### methods

 * **searchInItems(searchString?:string)** trigger quickSearch in the collection
 * **requestSearch()** start a new search base on attribute -searchString-.
 * **customSearchQuery(requestQuery: SearchRequest)** perform a custom search.
 * **search(searchRequest: SearchQuery)** start search query
 * **saveSelectedItem(updatedData?:Item):Promise<Item>** Save given item.
 * **clear()** empty collection


### Events

 *results-found* Fired when results are found by the API.

### Mixin
 Custom property | Description | Default
 ----------------|-------------|----------
 `--ozone-mosaic-item`  | css mixin for the list of item | `{ box-sizing: border-box;width:300px;height:200px;margin:10px;display:flex;overflow: hidden;}`
 `--ozone-mosaic-item-margins` | css mixin for the margin of previewContainer | `default 8px`


## install
 
 ```
 $ npm install --save ozone-mosaic
 ```
 

## command

`npm install`: install project dependency.

`npm run tsc`: run typeScript compiler.

`npm run build` build application.

`npm run test` bundle test files with webpack and run test with webComponent tester.

`npm run build:watch` bundle test files with webpack and watch on changes.

`npm run test:persist` bundle test files with webpack and watch on changes.

`npm run demo` start demo app.


[npm-image]: https://badge.fury.io/js/ozone-mosaic.svg
[npm-url]: https://npmjs.org/package/ozone-mosaic
