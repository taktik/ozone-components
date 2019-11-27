/**
 * A TypeScript class decorator that defines a custom element with name
 * `tagname` and the decorated class.
 */
import 'reflect-metadata'
import '../type/shadow'
import '../type/polymer'
import '../type/iron-ajax'
import '../type/missing'
declare interface ProjectWindow extends Window {
	[index: string]: any
}
declare var window: ProjectWindow

export function customElement(tagname: string) {
	return (clazz: any) => {
		clazz.is = tagname
		window[clazz.name] = clazz // Register class in windows se that is can be use without IMD module loading.
		// Useful for import in pure JS project.
		window.customElements.define(tagname, clazz)
	}
}

// export interface PropertyOptions {
// 	notify?: boolean
// 	type?: any
// 	value?: any
// }

/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
// export function property<T>(options?: PropertyOptions) {
// 	return (proto: any, propName: string): any => {
// 		const notify = (options && options.notify) as boolean
// 		const type = Reflect.getMetadata("design:type", proto, propName)
// 		const config = _ensureConfig(proto)
// 		config.properties[propName] = {
// 			type,
// 			notify
// 		}
// 	}
// }

export interface PropertyOptions {
	/**
	 * This field can be omitted if the Metadata Reflection API is configured.
	 */
	type?:
		| BooleanConstructor
		| DateConstructor
		| NumberConstructor
		| StringConstructor
		| ArrayConstructor
		| ObjectConstructor
	notify?: boolean
	reflectToAttribute?: boolean
	readOnly?: boolean
	computed?: string
	observer?: string | ((val: any, old: any) => void)
}

function createProperty(proto: any, name: string, options?: PropertyOptions): void {
	const notify = (options && options.notify) || false
	const reflectToAttribute = (options && options.reflectToAttribute) || false
	const readOnly = (options && options.readOnly) || false
	const computed = (options && options.computed) || ''
	const observer = (options && options.observer) || ''

	let type
	if (options && options.hasOwnProperty('type')) {
		type = options.type
	} else if (
		(window as any).Reflect &&
		Reflect.hasMetadata &&
		Reflect.getMetadata &&
		Reflect.hasMetadata('design:type', proto, name)
	) {
		type = Reflect.getMetadata('design:type', proto, name)
	} else {
		console.error(
			`A type could not be found for ${name}. ` + 'Set a type or configure Metadata Reflection API support.'
		)
	}

	if (!proto.constructor.hasOwnProperty('properties')) {
		Object.defineProperty(proto.constructor, 'properties', { value: {} })
	}

	const finalOpts: PropertyOptions = { type, notify, reflectToAttribute, readOnly, computed, observer }
	proto.constructor.properties[name] = finalOpts
}

/**
 * A TypeScript property decorator factory that defines this as a Polymer
 * property.
 *
 * This function must be invoked to return a decorator.
 */
export function property(options?: PropertyOptions) {
	return (proto: any, propName: string): any => {
		createProperty(proto, propName, options)
	}
}

export function domElement<T>() {
	// tslint:disable-next-line:no-empty
	return (proto: any, propName: string): any => {}
}

/**
 * A TypeScript property decorator factory that causes the decorated method to
 * be called when a property changes. `targets` is either a single property
 * name, or a list of property names.
 *
 * This function must be invoked to return a decorator.
 */

export function observe(...targets: string[]) {
	return (proto: any, propName: string): any => {
		if (!proto.constructor.hasOwnProperty('observers')) {
			proto.constructor.observers = []
		}
		proto.constructor.observers.push(`${propName}(${targets.join(',')})`)
	}
}

interface Config {
	properties: { [name: string]: PropertyDefinition }
	observers: string[]
}

interface PropertyDefinition {
	notify?: boolean
	type: Function
}

function _ensureConfig(proto: any): Config {
	const ctor = proto.constructor
	if (ctor.hasOwnProperty('__polymer_ts_config')) {
		return ctor.__polymer_ts_config
	}

	Object.defineProperty(ctor, 'config', {
		get() {
			return ctor.__polymer_ts_config
		}
	})

	const config: Config = (ctor.__polymer_ts_config = ctor.__polymer_ts_config || {})
	config.properties = config.properties || {}
	config.observers = config.observers || []
	return config
}
