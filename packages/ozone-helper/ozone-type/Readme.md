[![NPM version][npm-image]][npm-url]
# ozone-type

ozone type, Extracted from swagger

## Install

```
$ npm install ozone-type
```

## update ozone typings

This is a two-step process. First generate code using swagger-codegen:
```
swagger-codegen generate -i swagger.json -l typescript-angular2   -o ozone
```

Then generate Ozone Item classes using oz. For example:
```
oz -u taktik -s https://test.flowr.cloud/ozone -p <password> generate --package "" --target typescript -o ./ozone-components/packages/ozone-helper/ozone-type/ozone/model
```


tsc
git add ozone/model/*



[npm-image]: https://badge.fury.io/js/ozone-type.svg
[npm-url]: https://npmjs.org/package/ozone-type

