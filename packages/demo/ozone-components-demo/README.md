# ozone-components

Ozone-components is a library of polymer and javaScript modules that should facilitate development of web front-end for ozone.
Elements available in JavaScript and typeScript.

Elements are slit in 5 categories:
- ozone-api: Provide low level interface to ozone server.
- ozone-material: provide paper material design to display specific ozone content.
- ozone-helper: provide helper class for ozone operation.
- taktik-material: provide generic paper material design.
- taktik-helper: provide generic class helper.


## Demo

See demo application [demo](demo.html)


## Get start

### Install

Install elements with bower.

`bower install https://bitbucket.taktik.be/scm/poly/ozone-components.git`

ozone-components is a global packager, but each elements will be available for individual install.


### Configure ozone endpoints

ozone-api modules receive server API url from a config file that has to be present at the same level of you index file.
So make sure to have file [conf.ozone.json](conf.ozone.json). the format of the file is describe in the [ConfigFile](interfaces/_elements_ozone_api_ozone_config_types_ozone_config_.configfile.html) documentation


### Include modules html

Web components should be include with the \<link rel="import" src=".."> html tag. Such as

```
<link rel="import" href="../../bower_component/ozone-components/dist/ozone-material/ozone-login/ozone-login.html">
```

Include files from `ozone-components/dist` directory.

### TypeScrip includes

In addition to HTML import ozone-components are available in TypeScrip AMD module.

* Add reference module path in you tsconfig.json

> ```json
> {
>  "compilerOptions": {
>     "module": "amd",
>     "baseUrl": "./",
>        "paths": {"ozone-api-item": ["bower_components/ozone-api-item/ozone-api-item"]}
>    }
> }
> ```

* Include the module is your TypeScript Files

> ```typeScript
> import {OzoneApiItem} from 'ozone-login'
> ```

* ozone basic type

Ozone basic type can be found in `ozone-type` they can be imported as above.
`bower install https://bitbucket.taktik.be/scm/sandbox/ozone-type.git`

* AMD module missing

If for some elements such as ozone-config AMD module is not yet available. So you don't need to import them in you ts files because they just declare they interface.
But you still need to import them in your HTML.

Example
```typeScript
let myConfigCopy: ConfigType;

getOzoneConfig().configPromise.then((config)=> {myConfigCopy = config}

```


## contribute

Any contribution and comments are welcome.

Do not hesitate rapport issue and questions in the github issue.

You are also more than welcome to propose fix, via full request.


### Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

```
$ npm install -g polymer-cli
$ npm install -g https://github.com/marcelmeulemans/wct-junit-reporter.git
```

### Viewing Your Application

```
$ polymer serve
```

### Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

### generate distribute packager

Generate distribute package that import in project.
```bash
gulp dist
```
### generate documentation

```bash
node_modules/typedoc/bin/typedoc  --out  doc/ src/
```
