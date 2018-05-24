[![NPM version][npm-image]][npm-url]

# \<taktik-polymer-typeScript\>


Module providing development facilities for ozone polymer type script modules.




## install & configure this module in an other a typeScript project


- step 1: install dependency

> Install you dependency
> npm install --save taktik-polymer-typescript

- step 2: use node module resolution in tsconfig.json
```json
{
    "compilerOptions":{
        "moduleResolution": "node"
    }
}
```


- step 3: import where you need
```typescript
import {customElement} from 'taktik-polymer-typescript' // Import elements
```

[npm-image]: https://badge.fury.io/js/ozone-type.svg
[npm-url]: https://npmjs.org/package/ozone-type