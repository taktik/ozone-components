[![Build Status](https://travis-ci.org/taktik/taktik-polymer-typescript.svg?branch=master)](https://travis-ci.org/taktik/taktik-polymer-typescript)

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
