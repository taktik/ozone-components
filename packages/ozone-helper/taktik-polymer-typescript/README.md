[![NPM version][npm-image]][npm-url]

# taktik-polymer-typeScript

!! WARNING !! Unmaintained project

Module providing development facilities for ozone polymer V2 typescript modules.

## Decorators

* **@customElement(tagname: string)** Class decorator that defines a custom element with name `tagname`
* **@property(options?: PropertyOptions)** Property decorator factory that defines this as a Polymer property.
* **@observe(...targets: string[])** Method decorator  that causes the decorated method to be called when a property changes. `targets` is either a single property name, or a list of property names.

## install & configure this module in an other a typeScript project

> Install you dependency
> npm install --save taktik-polymer-typescript

```typescript
import {customElement} from 'taktik-polymer-typescript' // Import elements
```

[npm-image]: https://badge.fury.io/js/ozone-type.svg
[npm-url]: https://npmjs.org/package/ozone-type
