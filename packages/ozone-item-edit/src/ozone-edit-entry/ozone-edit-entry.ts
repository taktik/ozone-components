

import "polymer/polymer-element.html";
import "paper-input/paper-input.html";
import "./ozone-edit-entry.html";

import {customElement, property} from 'taktik-polymer-typescript'
import {LocalizedString} from 'ozone-type'

export interface PaperInputBehavior extends PolymerElement{

}

/**
 * OzoneEditEntryBehavior is a generic interface to different items fields editor.
 */
export interface OzoneEditEntryBehavior extends PolymerElement{
    $: {
        input: PolymerElement
    };

    /**
     * ozone type of the entry
     */
    type: string;

    /**
     * value of the field
     * @notify
     */
    value: any;

    /**
     * name of the field
     */
    name: LocalizedString;

    /**
     * computed label of the field
     * @readonly
     */
    label: string;

    /**
     * language to use in LocalizedName
     */
    language: string;


    /**
     * Set to true to disable this input.
     * @value false
     */
    disabled: boolean;

    /**
     * if the value is modify, is value will change to true.
     * @value false
     * @notify
     */
    isModify:boolean;

    /**
     * accessor to PaperInputBehavior element
     */
    inputElement: PaperInputBehavior;
}


export interface OzoneEditEntryConstructor {
    new (): OzoneEditEntryBehavior;
}
export interface OzoneEditEntryMixinType {
    (parentClass: PolymerElementConstructor):OzoneEditEntryConstructor
}

/**
 * Polymer Mixin for OzoneEditEntry.
 * demo: ```javaScript
 * export class MyOwnOzoneEdit extends OzoneEditEntryMixin(Polymer.Element) {}
 * ```
 * @type {OzoneEditEntryMixinType}
 */
export const OzoneEditEntryMixin:OzoneEditEntryMixinType = Polymer.dedupingMixin<any>(function(parentClass: PolymerElementConstructor){
    return class extends parentClass  {


        $: {
            input: PolymerElement
        }| undefined;

        type?: string;

        value: any;
        name?: LocalizedString;
        language: any;
        disabled: boolean = false;
        isModify:boolean = false;
        label?: string;

        static get properties(){
            return {
                name:{
                    type: String,
                },
                language:{
                    type: String,
                },
                 label:{
                    type: String,
                    computed: "toLabel(name, language)"
                },
                type:{
                    type: String,
                },
                value:{
                    type: Object,
                    notify: true
                },
                disabled:{
                    type: Boolean,
                    value: false,
                },
                isModify:{
                    type: Boolean,
                    value: false,
                    notify: true
                }
            }
        }

        toLabel(name: LocalizedString, language: string){
            if(name && name.strings && language) return name.strings[language];
        }

        /**
         * Returns a reference to the input element.
         */
        get inputElement() {
            if(! this.$)
                throw new Error()
            return this.$.input;
        }

        connectedCallback (){
            super.connectedCallback ();
            setTimeout(()=>{this.registerChangeListener()}, 0)
        }

        registerChangeListener (){
            this.inputElement.addEventListener('value-changed', (event) => {
                this.changeListenerCallback(event)
            })
        }

        changeListenerCallback(event: Event){
            this.set('isModify', true);
        }
    }

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
@customElement('ozone-edit-entry')
export class OzoneEditEntry extends OzoneEditEntryMixin(Polymer.Element) {

}

