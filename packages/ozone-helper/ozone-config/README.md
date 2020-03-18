[![NPM version][npm-image]][npm-url]

# ozone-config

## OzoneFormat

Expose Ozone media format and priority.
You can use webpack alias to overwrite this package in you project.

## OzoneConfig

!! WARNING !! this class is deprecated. !!
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
```javaScript
import * as Config from 'ozone-config';
const configPromise = Config.OzoneConfig.get();

```

## Install

```
$ npm install --save ozone-config
```


[npm-image]: https://badge.fury.io/js/ozone-config.svg
[npm-url]: https://npmjs.org/package/ozone-config

