import "polymer/polymer-element.html";
import "paper-input/paper-input.html";
import "./ozone-edit-entry.html";
import { LocalizedString } from 'ozone-type';
export interface PaperInputBehavior extends PolymerElement {
}
/**
 * OzoneEditEntryBehavior is a generic interface to different items fields editor.
 */
export interface OzoneEditEntryBehavior extends PolymerElement {
    $: {
        input: PolymerElement;
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
    isModify: boolean;
    /**
     * accessor to PaperInputBehavior element
     */
    inputElement: PaperInputBehavior;
}
export interface OzoneEditEntryConstructor {
    new (): OzoneEditEntryBehavior;
}
export interface OzoneEditEntryMixinType {
    (parentClass: PolymerElementConstructor): OzoneEditEntryConstructor;
}
/**
 * Polymer Mixin for OzoneEditEntry.
 * demo: ```javaScript
 * export class MyOwnOzoneEdit extends OzoneEditEntryMixin(Polymer.Element) {}
 * ```
 * @type {OzoneEditEntryMixinType}
 */
export declare const OzoneEditEntryMixin: OzoneEditEntryMixinType;
declare const OzoneEditEntry_base: OzoneEditEntryConstructor;
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
export declare class OzoneEditEntry extends OzoneEditEntry_base {
}
