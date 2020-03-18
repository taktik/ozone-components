[![NPM version][npm-image]][npm-url]
#  ozone-item-edit

This package contains several Webcomponents based on polymer V2 to edit an ozone item.

## sub-components

ozone-item-edit: edit an ozone item.

ozone-edit-text-entry: edit ozone text field

ozone-edit-json-entry: edit ozone json field

ozone-edit-set-entry: edit ozone set field

ozone-edit-number-entry: edit ozone number field

ozone-localized-string: display ozone localized string


## install

 ```
 $ npm install --save ozone-item-edit
 ```

## ozone-item-edit

### usage

 ```html
<ozone-item-edit item-data={{item}} invalid="{{invalid}}">  </ozone-item-edit>
```
### attributes

**itemData**: GenericItem item to display.
**invalid**: boolean true if the value is invalid.

### methods

**getUpdatedData**: get the item with it's modifies fields.

### Events:

**value-changed**: Trigger when a value has changed
 
 
 
## ozone-edit-xxx

### attributes

**type**: string ozone type of the entry
**value**: string value of the field
**name**: LocalizedString name of the field
**language**: string anguage to use in LocalizedName
**disabled**: boolean Set to true to disable this input.
**isModify**: boolean if the value is modify, is value will change to true.
**invalid**: boolean true if the value is invalid
**inputElement**: Returns a reference to the input element.

### events

 **value-changed**: Trigger when a value has changed
 **invalid-changed**: Trigger when invalid attribute has changed

 
 
 
[npm-image]: https://badge.fury.io/js/ozone-item-edit.svg
[npm-url]: https://npmjs.org/package/ozone-item-edit



## command

`npm run tsc`: run typeScript compiler.

`npm run build` build and bundle application with webpack.

`npm run test` bundle test files with webpack and run test with webComponent tester.

`npm run build:watch` bundle test files with webpack and watch on changes.

`npm run test:persist` bundle test files with webpack and watch on changes.
