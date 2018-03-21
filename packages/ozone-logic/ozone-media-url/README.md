[![Build Status](https://travis-ci.org/taktik/ozone-media-url.svg?branch=master)](https://travis-ci.org/taktik/ozone-media-url)

# \<ozone-media-url\>

Helper to convert ozone id to media preview

# usage

Install from github `bower install taktik/ozone-media-url`

## include in a JavaScript project

Include source.
```
<script type="text/javascript" src="bower_components/dist/ozone-media-url/index.js"></script>
```

Those two classes are now publicly available
OzonePreviewSize
OzoneMediaUrl


## include in typeScript project


add type refetrence in tsconfig.json
```
"compilerOptions":{
    "path":{
      "ozone-media-url": [
        "./bower_components/ozone-media-url/src/ozone-media-url"
      ]
    }
},
"include":[
"./bower_components/ozone-media-url/src/*./bower_components/ozone-media-url/src/"
]
```

# contribution guide

## Generate and see documentation

run `npm run doc` then `polymer serve doc/ -o`

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## install project dependency

run nmp and bower install.
```
$ npm install
$ bower install
```

## compile your code

```
$ node_modules/typescript/bin/tsc
```

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
