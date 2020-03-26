[![NPM version][npm-image]][npm-url]

# ozone-api-type

!! WARNING !! This package is now deprecated, it has been replaced by [ozone-typescript-client](../../ozone-typescript-client)
OzoneClient.TypeClient


 `ozone-api-type` is low level typescript module to ozone type.
 It provide read operation on collection type.

```bash
$ npm install --save ozone-api-type
```

 By default it create a instance of OzoneApiType in the dom.
 You can retrieve the default ItemApi with *getOzoneApiType*

* Example in html
```html
<ozone-api-type id="ozoneTypeApi" ></ozone-api-type>
```
* Example in javaScript
```javaScript
import {OzoneApiType, getOzoneApiType} from 'ozone-api-type'
const ozoneTypeAPI = getOzoneApiType(); // return instance of OzoneApiType located in the dom
```

# install

```
$ npm install ozone-api-type
```


[npm-image]: https://badge.fury.io/js/ozone-api-type.svg
[npm-url]: https://npmjs.org/package/ozone-api-type
