# \<ozone-api-item\>


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
$ npm install ozone-config
```
