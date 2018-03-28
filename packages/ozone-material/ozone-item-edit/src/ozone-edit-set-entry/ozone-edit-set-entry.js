/**
 * Created by hubert on 23/06/17.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <amd-module name="ozone-edit-set-entry"/>
import './ozone-edit-set-entry.html';
import { customElement } from 'taktik-polymer-typescript';
import 'ozone-edit-entry';
import { OzoneEditEntryMixin } from 'ozone-edit-entry';
/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as set<string>.
 *
 */
let OzoneEditSetEntry = class OzoneEditSetEntry extends OzoneEditEntryMixin(Polymer.Element) {
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
    textToSet(textValue) {
        return textValue.replace(/ /g, '').split(',');
    }
    setTotext(arrayValue) {
        return arrayValue.join(', ');
    }
    isValueAndTextEqual() {
        let textValue = this.textValue || '';
        let value = this.value || [];
        return this.textToSet(textValue).join() == value.join();
    }
    valueChange() {
        if (!this.isValueAndTextEqual()) {
            this.set('textValue', this.setTotext(this.value));
        }
    }
    textChange() {
        if (!this.isValueAndTextEqual()) {
            this.set('value', this.textToSet(this.textValue));
            this.set('isModify', true);
        }
    }
};
OzoneEditSetEntry = __decorate([
    customElement('ozone-edit-set-entry')
], OzoneEditSetEntry);
export { OzoneEditSetEntry };
