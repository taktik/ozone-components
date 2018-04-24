/**
 * Created by hubert on 8/06/17.
 */

import "polymer/polymer-element.html"
import "paper-item/paper-item.html"
import "paper-icon-button/paper-icon-button.html"
import "iron-image/iron-image.html"

import './ozone-item-action.html'
import * as Config from 'ozone-config'

import {customElement, property, observe} from 'taktik-polymer-typescript'
import {Item, Media} from 'ozone-type';
import {OzoneMediaUrl, OzonePreviewSize, SizeEnum} from 'ozone-media-url'
import {OzoneApiType, getOzoneApiType} from 'ozone-api-type'

/**
 * `ozone-item-preview` is hight level polymer module to display preview information an ozone item.
 *
 * Example in html:
 * ```html
 * <ozone-item-preview itemData=[[item]]></ozone-item-preview>
 * ```
 *
 * ### Events
 *
 * * *edit-item* fire on click on close button.
 *
 *  ### Mixin
 *  Custom property | Description | Default
 *  ----------------|-------------|----------
 *  --ozone-item-preview | css mixin for preview container | `{}`
 */
@customElement('ozone-item-action')
export class OzoneItemAction extends Polymer.Element{


    /**
     * item to display
     */
    @property({type: Object})
    itemData: Item | null = null;

    @property({type: Boolean})
    selected: boolean = false;

    @property({type: String})
    action: string = 'nop';

    private _editItem(e: Event){
        this.dispatchEvent(new CustomEvent('edit-item',
            {bubbles: true, detail:this.itemData, composed: true} as CustomEventInit));

        e.preventDefault();
        e.stopPropagation();
    }
    private _infoItem(e: Event){
        this.set('action', 'info-item')
        this.dispatchEvent(new CustomEvent('info-item',
            {bubbles: true, detail:this.itemData, composed: true} as CustomEventInit));

        e.preventDefault();
        e.stopPropagation();
    }

    private _delete(e: Event){
        this.dispatchEvent(new CustomEvent('delete-item',
            {bubbles: true, detail:this.itemData, composed: true} as CustomEventInit));

        e.preventDefault();
        e.stopPropagation();
    }

    @observe('selected')
    private _Focuschanged(focus: boolean){
        if(focus){
            this.$.actionsPanel.classList.add("open");
        } else {
            this.$.actionsPanel.classList.remove('open');
        }
    }

}