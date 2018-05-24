[![NPM version][npm-image]][npm-url]

# \<ozone-config\>

Expose ozone API configuration.
Configuration is loaded from ./conf.ozone.json

## Usage

Import from source
```html
<script src="../dist/ozone-config.js"></script>
<script>
  OzoneConfig().get().then((config) => {
      // Do something with the config
  });
</script>
```


Using es6 import
```javaSript
import * as Config from 'ozone-config';
const configPromise = Config.OzoneConfig.get();

```

## Install

```
$ npm install --save ozone-config
```


[npm-image]: https://badge.fury.io/js/ozone-config.svg
[npm-url]: https://npmjs.org/package/ozone-config

