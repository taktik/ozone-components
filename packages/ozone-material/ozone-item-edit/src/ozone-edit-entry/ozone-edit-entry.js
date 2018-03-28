/// <amd-module name="ozone-edit-entry"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "polymer/polymer-element.html";
import "paper-input/paper-input.html";
import "./ozone-edit-entry.html";
import { customElement } from 'taktik-polymer-typescript';
/**
 * Polymer Mixin for OzoneEditEntry.
 * demo: ```javaScript
 * export class MyOwnOzoneEdit extends OzoneEditEntryMixin(Polymer.Element) {}
 * ```
 * @type {OzoneEditEntryMixinType}
 */
export const OzoneEditEntryMixin = Polymer.dedupingMixin(function (parentClass) {
    return class extends parentClass {
        static get properties() {
            return {
                name: {
                    type: String,
                },
                language: {
                    type: String,
                },
                label: {
                    type: String,
                    computed: "toLabel(name, language)"
                },
                type: {
                    type: String,
                },
                value: {
                    type: Object,
                    notify: true
                },
                disabled: {
                    type: Boolean,
                    value: false,
                },
                isModify: {
                    type: Boolean,
                    value: false,
                    notify: true
                }
            };
        }
        toLabel(name, language) {
            if (name && name.strings && language)
                return name.strings[language];
        }
        /**
         * Returns a reference to the input element.
         */
        get inputElement() {
            return this.$.input;
        }
        connectedCallback() {
            super.connectedCallback();
            setTimeout(() => { this.registerChangeListener(); }, 0);
        }
        registerChangeListener() {
            this.inputElement.addEventListener('value-changed', (event) => {
                this.changeListenerCallback(event);
            });
        }
        changeListenerCallback(event) {
            this.set('isModify', true);
        }
    };
});
/**
 * <ozone-edit-entry> is an element to edit ozone items fields as string.
 *
 * ```html
 * <ozone-edit-entry
 *      type="string"
 *      value={{someValue}}
 *      language="en"
 *      name="[[fieldName]]"
 *      ></ozone-edit-entry>
 * ```
 */
let OzoneEditEntry = class OzoneEditEntry extends OzoneEditEntryMixin(Polymer.Element) {
};
OzoneEditEntry = __decorate([
    customElement('ozone-edit-entry')
], OzoneEditEntry);
export { OzoneEditEntry };
