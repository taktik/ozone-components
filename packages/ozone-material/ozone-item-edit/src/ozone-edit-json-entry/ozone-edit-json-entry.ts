/**
 * Created by hubert on 23/06/17.
 */

import "paper-input/paper-textarea.html"
import "./ozone-edit-json-entry.html"
import {customElement, property} from 'taktik-polymer-typescript'
import {OzoneEditEntry} from '../ozone-edit-entry/ozone-edit-entry'

/**
 * <ozone-edit-json-entry> is an element to edit ozone items fields as a json.
 *
 */
@customElement('ozone-edit-json-entry')
export class OzoneEditJsonEntry extends OzoneEditEntry {
    @property({type: String})
    textValue?:string;

    static get observers() {
        return [
            'valueChange(value)',
            'textChange(textValue)'
        ]
    }
    registerChangeListener (){
        // NOP prevent default behavior that listen on change event
    }

    jsonTotext(rawValue:object):string{
        return JSON.stringify(rawValue);
    }

    isValueAndTextEqual():boolean{
        let value = this.value || {};
        return this.textValue === this.jsonTotext(value);
    }

    valueChange () {
        if(! this.isValueAndTextEqual()){
            this.set('textValue', this.jsonTotext(this.value));
        }
    }

    textChange () {
        try{
            const value = JSON.parse(this.textValue as string)
            if(! this.isValueAndTextEqual()){
                this.set('value', value);
                this.set('isModify', true);
                this.set('invalid', false)
            }
        } catch (e) {
            this.set('invalid', true)
        }
    }
}