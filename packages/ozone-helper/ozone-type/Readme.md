[![NPM version][npm-image]][npm-url]
# ozone-type

Expose Ozone and Flowr types in typescript

## Install

```
$ npm install ozone-type
```
## Utilities

* `Item`: base type for ozone items.
* `OzoneType`: decorator for class that extend Item.
* `FromOzone<T extends Item>`: template type for Item received from ozone.
* `function toPatch<T extends Item>(item: FromOzone<T>): Patch<T>`: transform Item received from ozone to item that can be saved.
* `function toPatchWithUndefinedAsNull<T extends Item>(item: FromOzone<T>): Patch<T>`: same as function toPatch but it set filed explicitly undefined to null so that they can be erase on ozone

Usage example
```typescript
import { toPatch, Patch, UUID, FromOzone } from 'ozone-type'
declare function getMyNewTypeFromOzone(id: UUID): FromOzone<MyNewType>
declare function saveMyNewTypeToOzone(data: Patch<MyNewType>): FromOzone<MyNewType>

const myData = getMyNewTypeFromOzone('myID')
const myDataToUpdate = toPatch(myData)
myDataToUpdate.aLocalizedAttr = {
	fr: 'bonjour',
	en: 'hello'
}
saveMyNewTypeToOzone(myDataToUpdate)
```

## Add one type

Add a file in ozone/model
````typeScript
// import base type
import { OzoneType, Item, UUID } from 'ozone-type'

/**
 * MyNewType is a new ozone object
 */
OzoneType('my.new.type') // decorate to set type by default
export class MyNewType extends Item { // All the dynamic typed ozone object extend Item

	anAttribute?: UUID
	aLocalizedAttr?: {[key: string]: string}
	/**
	 * Recopy constructor
	 * @param src
	 */
	constructor(src: MyNewType) {
		super(src)
		this.anAttribute = src.anAttribute
		this.aLocalizedAttr = src.aLocalizedAttr
	}

	// Use static method for helpers. So that new is not mandatory.
	static getAttrIn(src: MyNewType, language: string): string | undefined {
		src.aLocalizedAttr = src.aLocalizedAttr || {}
		return src.aLocalizedAttr[language]
	}
}
````

Then add export statment in ozone/model/models.ts

## Bulck Update all ozone typings

Generate Ozone Item classes using oz. For example:
```
oz -u taktik -s https://test.flowr.cloud/ozone -p <password> generate --package "" --target typescript -o ./ozone-components/packages/ozone-helper/ozone-type/ozone/model
```
Then commit
git add ozone/model/*


[npm-image]: https://badge.fury.io/js/ozone-type.svg
[npm-url]: https://npmjs.org/package/ozone-type

