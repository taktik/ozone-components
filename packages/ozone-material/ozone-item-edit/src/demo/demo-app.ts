import "polymer/polymer-element.html";
import './demo-app.html';
import {customElement, observe, property} from 'taktik-polymer-typescript'
import "../ozone-item-edit"
import {OzoneItemEdit} from "../ozone-item-edit"
import {Item} from "ozone-type"

@customElement('demo-app')
class demoApp extends Polymer.Element {

    $: {
        ozoneItemEdit: OzoneItemEdit,
    } | any;

    @property({type: Object})
    dataSet:{[key: string]: any}={
        media:       {type: "media"},
        item:        {type: "item"}
    };


    @property({type: Object})
    itemData?:Item;
    @property({type: String})
    itemDataResult?:string;

    @property({type: String})
    selectedData?:string;

    @property({
        type: Boolean,
    })
    invalid:boolean = false;

    save(){
        this.itemDataResult = JSON.stringify(this.$.ozoneItemEdit.getUpdatedData());
    }
    clear(){
        this.itemDataResult = undefined;
        this.itemData = undefined
    }
    @observe('selectedData')
    selectedDataChange(){
        if(this.selectedData){
            this.itemData = this.dataSet[this.selectedData]
        }
    }

}