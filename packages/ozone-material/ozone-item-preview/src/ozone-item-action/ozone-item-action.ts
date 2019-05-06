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

/**
 * `ozone-item-action` display action preview.
 *
 * Example in html:
 * ```html
 * <ozone-item-action itemData=[[item]]></ozone-item-action>
 * ```
 *
 * ### Events
 *
 * * *edit-item*
 * * *delete-item*
 * * *info-item*
 *
 *  ### Mixin
 *  Custom property | Description | Default
 *  ----------------|-------------|----------
 *  --actions-panel-colors | css mixin for action panel | `{...}`
 *  --actions-panel-icons-color | css mixin for action icon | `{color:white;min-height:30px; min-width:30px;}`
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

    ready() {
        super.ready();
        if(this.shadowRoot) {
            const actions = this.shadowRoot.querySelectorAll<HTMLElement>('.action')
            Array.from(actions).forEach((action: HTMLElement) => {
                action.addEventListener('tap', (e: Event) => {
                    const event = e as MouseEvent
                    if(event.target && (event.target as HTMLElement).hasAttribute('event')){
                        const eventName = (event.target as HTMLElement).getAttribute('event') as string
                        this.dispatchEvent(new CustomEvent(eventName,
                            {bubbles: true, detail: this.itemData, composed: true} as CustomEventInit));
                        e.preventDefault();
                        e.stopPropagation();
                    }
                })
            })
        }
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
