/// <amd-module name="ozone-edit-number-entry"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from 'taktik-polymer-typescript';
import { OzoneEditEntryMixin } from 'ozone-edit-entry';
import "paper-input/paper-input.html";
import "ozone-edit-entry";
import "./ozone-edit-number-entry.html";
/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as number.
 *
 */
let OzoneEditNumberEntry = class OzoneEditNumberEntry extends OzoneEditEntryMixin(Polymer.Element) {
    static get properties() {
        return {
            textValue: {
                type: String,
            },
        };
    }
    static get observers() {
        return [
            'valueChange(value)',
            'textChange(textValue)'
        ];
    }
    registerChangeListener() {
        // NOP prevent default behavior that listen on change event
    }
    textToNumber(textValue) {
        if (this.textValue === '') {
            return null;
        }
        else {
            return Number(textValue);
        }
    }
    isValueAndTextEqual() {
        return this.textToNumber(this.textValue) == this.value;
    }
    valueChange() {
        if (!this.isValueAndTextEqual()) {
            this.set('textValue', this.value);
        }
    }
    textChange() {
        if (!this.isValueAndTextEqual()) {
            this.set('value', this.textToNumber(this.textValue));
            this.set('isModify', true);
        }
    }
};
OzoneEditNumberEntry = __decorate([
    customElement('ozone-edit-number-entry')
], OzoneEditNumberEntry);
export { OzoneEditNumberEntry };
