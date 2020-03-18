[![NPM version][npm-image]][npm-url]
# ozone-api-item


!! WARNING !! this package is deprecated. Please use OzoneClient.ItemClient from ozone-typescript-client. !!

`ozone-api-item` is low level es6 module to ozone api.
It provide CRUD operation and search in a given collection.

## Usage


```javaScript
import {OzoneApiItem} from 'ozone-api-item'
const ozoneApiSearch = new OzoneApiItem(); // return instance of OzoneApiItem located in the dom
const result = ozoneApiSearch.on('item').getOne('an-id');
```


## Install

```
$ npm install ozone-api-item
```

[npm-image]: https://badge.fury.io/js/ozone-api-item.svg
[npm-url]: https://npmjs.org/package/ozone-api-item
