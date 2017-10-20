[![Build Status](https://travis-ci.org/taktik/ozone-api-type.svg?branch=master)](https://travis-ci.org/taktik/ozone-api-type)
[![NPM version][npm-image]][npm-url]
 [![Dependency Status][daviddm-image]][daviddm-url]

# \<ozone-api-type\>

 `ozone-api-type` is low level polymer module to ozone type.
 It provide read operation on collection type.

 By default it create a instance of OzoneApiType in the dom.
 You can retrieve the default ItemApi with *getOzoneApiType*

* Example in html
```html
<ozone-api-type id="ozoneTypeApi" ></ozone-api-type>
```
* Example in javaScript
```javaScript
const ozoneTypeAPI = getOzoneApiType(); // return instance of OzoneApiType located in the dom
```

## install project dependency

run nmp and bower install.
```
$ npm install
```


## Running Tests

```
$ npm test
```

[npm-image]: https://badge.fury.io/js/ozone-api-type.svg
[npm-url]: https://npmjs.org/package/ozone-api-type
[daviddm-image]: https://david-dm.org/taktik/ozone-api-type.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/taktik/ozone-api-type