/**
 * Created by hubert on 23/06/17.
 */


/// <amd-module name="ozone-edit-set-entry"/>

import './ozone-edit-set-entry.html'

import {customElement, property} from 'taktik-polymer-typescript'
import '../ozone-edit-entry/ozone-edit-entry'
import {OzoneEditEntry, OzoneEditEntryMixin, OzoneEditEntryConstructor} from '../ozone-edit-entry/ozone-edit-entry'
/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as set<string>.
 *
 */

@customElement('ozone-edit-set-entry')
export class OzoneEditSetEntry extends OzoneEditEntryMixin(Polymer.Element) {
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

    textToSet(textValue?:string):Array<string>{
        textValue = textValue|| '';
        return textValue.replace(/ /g, '').split(',');
    }

    setTotext(arrayValue:Array<string>):string{
        return arrayValue.join(', ')
    }

    isValueAndTextEqual():boolean{
        let textValue = this.textValue || '';
        let value = this.value || [];
        return this.textToSet(textValue).join() == value.join();
    }

    valueChange () {
        if(! this.isValueAndTextEqual()){
            this.set('textValue', this.setTotext(this.value));
        }
    }

    textChange () {
        if(! this.isValueAndTextEqual()){
            this.set('value', this.textToSet(this.textValue));
            this.set('isModify', true);
        }
    }


}
