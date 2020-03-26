[![NPM version][npm-image]][npm-url] 
#  ozone-item-preview


`ozone-item-preview` is hight level polymer module to display preview information of an ozone item.

Example in html:
```html
<ozone-item-preview itemData={{item}}></ozone-item-preview>
```

### Events

 *edit-item* fire on click on close button.
 
### Mixin
 Custom property | Description | Default
 ----------------|-------------|----------
 --ozone-item-preview | css mixin for preview container | `{}`


`ozone-item-action` display action preview.

Example in html:
```html
<ozone-item-action itemData={{item}}></ozone-item-action>
```

### Events

* *edit-item*
* *delete-item*
* *info-item*

 ### Mixin
 Custom property | Description | Default
 ----------------|-------------|----------
 --actions-panel-colors | css mixin for action panel | `{...}`
 --actions-panel-icons-color | css mixin for action icon | `{color:white;min-height:30px; min-width:30px;}`

## install
 
 ```
 $ npm install --save ozone-item-preview
 ```
 

[npm-image]: https://badge.fury.io/js/ozone-item-preview.svg
[npm-url]: https://npmjs.org/package/ozone-item-preview

## command

`npm install`: install project dependency.

`npm run tsc`: run typeScript compiler.

`npm run build` build and bundle application with webpack.

`npm run test` bundle test files with webpack and run test with webComponent tester.

`npm run build:watch` bundle test files with webpack and watch on changes.

`npm run test:persist` bundle test files with webpack and watch on changes.

`npm run doc` generate project documentation with typedoc.
