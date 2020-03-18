[![NPM version][npm-image]][npm-url]
# ozone-default-client


`ozone-default-client` create a default instance on an ozone client using session credential.
This client aime to be used in a browser and it's used by the ozone-material.
It's possible to overwrite this package with a webpack alias.

## Install

```
$ npm install --save ozone-default-client
```

## usage
```
import { getDefaultClient } from 'ozone-default-client'

const ozoneClient = getDefaultClient()
```

[npm-url]: https://npmjs.org/package/ozone-default-client
