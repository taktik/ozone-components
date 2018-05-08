[![Build Status](https://travis-ci.org/taktik/ozone-components.svg?branch=master)](https://travis-ci.org/taktik/ozone-components)

# ozone-components

Ozone-components is a library of polymer and javaScript modules that should facilitate development of web front-end for ozone.
Elements available in JavaScript and typeScript.

Elements are slit in 5 categories:
- ozone-api: Provide low level interface to ozone server.
- ozone-material: provide paper material design to display specific ozone content. (Based on Polymer)
- ozone-helper: provide generic class helper.
- ozone-logic: provide helper class for ozone operation.


## Demo

See demo application [demo](demo.html)

## Modules

- ozone-helper:

 - [ozone-type](packages/ozone-helper/ozone-type) Declaration of ozone type
 - [ozone-config](packages/ozone-helper/ozone-config) Expose ozone API configuration. Configuration is loaded from ./conf.ozone.json
 - [ozone-search-helper](packages/ozone-helper/ozone-search-helper) Helper for ozone search queries
 - [taktik-polymer-typescript](packages/ozone-helper/taktik-polymer-typescript) Module providing development facilities for ozone polymer and typescript modules.
- ozone-api
 - [ozone-api-type](packages/ozone-api/ozone-api-type) ozone-api-type is low level polymer module to ozone type. It provide read operation on collection type.
 - [ozone-api-authentication](packages/ozone-api/ozone-api-authentication) Low level wrapper around ozone login, logout and authentication api
 - [ozone-api-upload](packages/ozone-api/ozone-api-upload) UploadFileRequest is a JavaScrip class that can be use as an XMLHttpRequest to upload media using ozone v2 upload chanel.
 - [ozone-api-edit-video](packages/ozone-api/ozone-api-edit-video) ES6 module written in typeScript to save selected video chunks.
 - [ozone-api-item](packages/ozone-api/ozone-api-item) low level es6 module to ozone api. It provide CRUD operation and search in a given collection.
- ozone-logic
 - [ozone-collection](packages/ozone-logic/ozone-collection) generic polymer web-component to manage collection of ozone items.
 - [ozone-iron-list](packages/ozone-logic/ozone-iron-list) Implementation of an iron-list to display an ozone search result with lazy loading..
 - [ozone-media-url](packages/ozone-logic/ozone-media-url) Helper to convert ozone id to media preview.
- ozone-material
 - [ozone-video-player](packages/ozone-material/ozone-video-player) WebComponent that play video from Ozone.
 - [ozone-free-text-search](packages/ozone-material/ozone-free-text-search) WebComponent that play video from Ozone.
 - [ozone-upload](packages/ozone-material/ozone-upload) configurable web component to upload files on ozone. Based on vaadin-upload.
 - [ozone-item-preview](packages/ozone-material/ozone-item-preview)  Webcomponent based on polymer to preview an ozone item
 - [ozone-item-edit](packages/ozone-material/ozone-item-edit) This package contains several Webcomponents based on polymer to edit an ozone item.
 - [ozone-mosaic](packages/ozone-material/ozone-mosaic) Webcomponent to display mosaic of ozone preview

## Get start

This project contains a set of npm library that can be install individually.
There are aime to be build with webpack.
See demo project for webpack config example.

## contribute

Any contribution and comments are welcome.

Do not hesitate rapport issue and questions in the github issue.

You are also more than welcome to propose fix, via full request.


### A Lerna project

ozone-components are centralize in a Lerna repo. Please refers to lerna documentation for generic usage such as project import, dependency installation or project bootstrap.

### Set up

```
$ npm install
$ npm bootstrap
```

### Viewing demo Application

```
$ npm run demo
```

### Running Tests

```
$ npm run test
```

### generate documentation

```bash
$ npm run doc
```
