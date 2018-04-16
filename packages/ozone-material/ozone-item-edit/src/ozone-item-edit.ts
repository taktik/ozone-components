import "polymer/polymer-element.html"
import {OzoneApiType, getOzoneApiType} from 'ozone-api-type'

import "./ozone-localized-string/ozone-localized-string"

import './ozone-item-edit.html'
import {customElement, property, observe} from 'taktik-polymer-typescript'
import {Item, FieldDescriptor, Grants} from 'ozone-type'


import './ozone-edit-entry/ozone-edit-entry'
import {OzoneEditEntry} from './ozone-edit-entry/ozone-edit-entry'
import './ozone-edit-set-entry/ozone-edit-set-entry';
import './ozone-edit-text-entry/ozone-edit-text-entry';
import './ozone-edit-number-entry/ozone-edit-number-entry';
import './ozone-edit-json-entry/ozone-edit-json-entry';

import 'ozone-api-type'
import {FieldsPermission} from 'ozone-api-type'


export interface EditableFields{
    fieldType: string,
    name: string,
    value:string,
}

class TruePermission extends FieldsPermission{

    isFieldEditable(fieldName:string):boolean{
        return true
    }
}

/**
 * <ozone-item-edit> is an element that provide material design to edit an ozone Item.
 *
 * ```html
 *  <ozone-item-edit item-data={{item}}>  </ozone-item-edit>
 * ```
 */
@customElement('ozone-item-edit')
export class OzoneItemEdit  extends Polymer.Element  {
    /**
     * item to display
     */
    @property({type: Object, notify: true})
    itemData: Item | null = null;

    ozoneTypeApi: OzoneApiType = getOzoneApiType();

    /**
     * Returns true if the value is invalid.
     */
    @property({
        type: Boolean,
        notify: true
    })
    invalid:boolean = false;

    $: {
        editableList: Element,
        elementView: HTMLElement,
    } | any;

    static editEntryClass = 'editEntry';

    @observe('itemData')
    async dataChange(data?:Item){

        this.$.elementView.style.visibility = 'hidden'
        if(!data){
            return ;
        }
        if(!data.hasOwnProperty('type')){
            return ;
        }
        this.removeEntryIfExist();

        const fields:Array<FieldDescriptor> = await(this.ozoneTypeApi.getAllFields(data.type));
        let permission;
        if( data.id) {
            permission = await(this.ozoneTypeApi.getPermissions(fields, data.id));
        } else {
            permission = new TruePermission({})
        }
        fields.sort((a, b)=>{return a.fieldType.localeCompare(b.fieldType)});

        for(let description of fields){
            if(description){
                await (this.addInputElement(description, data, permission));
            }
        }
        this.$.elementView.style.visibility = 'visible'
    }

    private async addInputElement(description:FieldDescriptor, data: Item, permission: FieldsPermission) {
        const fieldType = description.fieldType || "unknown";

        const identifier = description.identifier;

        const fieldName = description.name || {strings: {en: identifier + '*'}};


        const listEntry = document.createElement('div');
        listEntry.className = 'ozoneEditItemContent';


        const editableItemName = this.getEditableItemName(fieldType);

        if(typeof(editableItemName) == 'string') {

            const editableItem = document.createElement(editableItemName) as (OzoneEditEntry);
            editableItem.className = OzoneItemEdit.editEntryClass;
            editableItem.id = identifier;
            editableItem.type = fieldType;
            editableItem.value = data[identifier];
            editableItem.language = 'en';
            editableItem.name = fieldName;

            editableItem.addEventListener("value-changed", (e) => {
                if(this.itemData)
                 this.itemData[identifier] = (e as CustomEvent).detail.value;
            });
            editableItem.addEventListener("invalid-changed", (e) => {
                this.updateInvalidValue()
            });

            const isEditAllow: boolean = permission.isFieldEditable(identifier);

            editableItem.disabled = !isEditAllow;


            listEntry.appendChild(editableItem);
            this.$.editableList.appendChild(listEntry);

            editableItem.inputElement.addEventListener('value-changed', (d:Event) => {
                this.dispatchEvent(new CustomEvent('value-changed',
                    {bubbles: true}));
            })
        }
    }

    private getEditableItemName(type:string):string | undefined{
        let editableItemName;
        switch(type){
            case 'string':
            case 'blob':
            case 'date':
                editableItemName = 'ozone-edit-entry';
                break;
            case 'set<string>':
                editableItemName = 'ozone-edit-set-entry';
                break;

            case 'analyzed_string':
                editableItemName = 'ozone-edit-text-entry';
                break;
            case 'integer':
            case 'float':
            case 'double':
                editableItemName = 'ozone-edit-number-entry';
                break;
            case 'map<ref<document>>':
                editableItemName = 'ozone-edit-json-entry';
                break;
        }
        return editableItemName
    }

    /**
     * get the item with it's modifies fields.
     * @return {Item}
     */
    getUpdatedData():Item{
        if(!this.itemData)
            throw new Error()
        const entryList = this.getEntryList();
        const updatedItem: Item = {
            type: this.itemData.type,
            id: this.itemData.id,
        };
        for (let index = 0; index < entryList.length; index ++){
            let entry = entryList.item(index) as OzoneEditEntry;
            if(entry.isModify) {
                updatedItem[entry.id] = entry.value;
            }
        }
        return updatedItem
    }

    updateInvalidValue(){
        let invalid: boolean = false;
        const entryList = this.getEntryList()
        for (let index = 0; index < entryList.length; index ++){
            invalid =  entryList.item(index).invalid || invalid;
        }
        this.set('invalid', invalid)
    }

    private getEntryList() {
        return this.$.editableList.getElementsByClassName(OzoneItemEdit.editEntryClass);
    }
    private removeEntryIfExist(){
        const entryList = this.$.editableList.getElementsByClassName('ozoneEditItemContent');
        while (entryList.length > 0){
            entryList[0].remove();
        }
    }
}