import {customElement, property} from 'taktik-polymer-typescript'
import {OzoneEditEntry} from '../ozone-edit-entry/ozone-edit-entry'
import '../ozone-edit-entry/ozone-edit-entry'
import "paper-input/paper-input.html"
import "./ozone-edit-number-entry.html"

/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as number.
 *
 */

@customElement('ozone-edit-number-entry')
export class OzoneEditNumberEntry extends OzoneEditEntry {
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

    textToNumber(textValue?:string):Number| null{

        if(!this.textValue || this.textValue === ''){
            return null;
        } else {
            return Number(textValue);
        }
    }


    isValueAndTextEqual():boolean{
        return this.textToNumber(this.textValue) == this.value;
    }

    valueChange () {
        if(! this.isValueAndTextEqual()){
            this.set('textValue', this.value);
        }
    }

    textChange () {
        if(! this.isValueAndTextEqual()){
            this.set('value', this.textToNumber(this.textValue));
            this.set('isModify', true);
        }
    }
}
