

import "polymer/polymer-element.html";
import "paper-input/paper-input.html";
import "./ozone-edit-entry.html";

import {customElement, property, observe} from 'taktik-polymer-typescript'
import {LocalizedString} from 'ozone-type'

export interface PaperInputBehavior extends PolymerElement{

}
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
@customElement('ozone-edit-entry')
export class OzoneEditEntry extends Polymer.Element {

    /**
     * ozone type of the entry
     */
    @property({
        type: String,
    })
    type?: string;

    /**
     * value of the field
     * @notify
     */
    @property({
        type: Object,
        notify: true
    })
    value: any;

    /**
     * name of the field
     */
    @property()
    name?: LocalizedString;

    /**
     * computed label of the field
     * @readonly
     */
    @property({
        type: String,
        computed: "toLabel(name, language)"
    })
    label?: string;

    /**
     * language to use in LocalizedName
     */
    @property({
        type: String,
    })
    language?: string;


    /**
     * Set to true to disable this input.
     * @value false
     */
    @property({
        type: Boolean
    })
    disabled: boolean = false;

    /**
     * if the value is modify, is value will change to true.
     * @value false
     * @notify
     */
    @property({
        type: Boolean,
        notify: true
    })
    isModify:boolean = false;

    /**
     * Returns true if the value is invalid.
     */
    @property({
        type: Boolean,
        notify: true
    })
    invalid:boolean = false;

    $: {
        input: PolymerElement
    }| any;

    toLabel(name: LocalizedString, language: string){
        if(name && name.strings && language) return name.strings[language];
    }

    /**
     * Returns a reference to the input element.
     */
    get inputElement() {
        return this.$.input;
    }

    connectedCallback (){
        super.connectedCallback ();
        setTimeout(()=>{this.registerChangeListener()}, 0)
    }

    registerChangeListener (){
        this.inputElement.addEventListener('value-changed', (event: Event) => {
            this.changeListenerCallback(event)
        })
    }

    changeListenerCallback(event: Event){
        this.set('isModify', true);
    }

    @observe('invalid')
    invalidChange(event: CustomEvent){
        this.dispatchEvent(new CustomEvent('invalid-changed', {detail: this.invalid}))
    }

}

