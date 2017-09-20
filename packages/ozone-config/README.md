[![Build Status](https://travis-ci.org/taktik/ozone-config.svg?branch=master)](https://travis-ci.org/taktik/ozone-config)

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
$ npm install ozone-config
```
