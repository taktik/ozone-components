import "polymer/polymer-element.html"

import "paper-item/paper-item.html"
import "paper-button/paper-button.html"
import "iron-flex-layout/iron-flex-layout.html"

import './video-edit-panel.html'

import {customElement, domElement} from 'taktik-polymer-typescript';
import { Video, FromOzone } from 'ozone-type';
import 'ozone-api-edit-video';
import {OzoneApiEditVideo} from 'ozone-api-edit-video';

import 'ozone-video-player'
import {OzoneVideoPlayer} from 'ozone-video-player'
/**
 * <ozone-edit-panel> is an element that display an ozone media edit in a panel.
 *
 * ```html
 * <ozone-edit-panel selected-item={{item}}>  <ozone-edit-panel>
 * ```
 *
 * ### Events
 *
 * * *close-tap* fire on click on close button.
 * * *save-tap* fire on click on save button.
 *
 */
@customElement('video-edit-panel')
export class VideoEditPanel  extends Polymer.Element {

    @domElement()
    $: {
        mediaPlayer: OzoneVideoPlayer;
        addMarker: HTMLElement,
        clear: HTMLElement,
        selectType: HTMLElement,
    };

    /**
     * Item to edit
     */
    selectedItem: FromOzone<Video>;

    markersJson:string;

    markers: object;


    private _videoEditor?: OzoneApiEditVideo;

    get videoEditor(): OzoneApiEditVideo{
        if(!this._videoEditor)
            this._videoEditor =  new OzoneApiEditVideo();
        return this._videoEditor;
    }

    subtitles: Array<string>
    static get properties() {
        return {
            selectedItem:{
                type:Object,
            },
            display:{
                type:Boolean,
                value: false,
            },
            markers:{
                type:Array,
            },
            markersJson:{
                type:String,
            },
            subtitles:{
                type:Array,
            },
            subtitleSelect:{
                type:String,
                value:'en'
            },
            hidden: {
                type: Boolean,
                value: false,
                observer: 'hiddenChange'
            },
        }
    }

    static get observers(){
        return ['markersChange(markers.*)'];
    }

    private markersChange(markers: object){
        this.set('markersJson', JSON.stringify(this.markers));
    }

    private _closePanel() {
        this.dispatchEvent(new CustomEvent('close-tap', {bubbles: true}));
    }

    private async _save(){

        let selectedChunks = this.$.mediaPlayer.getSelectedChunks(true);
        console.log('newVideo', selectedChunks);
        let video = null;
        if(selectedChunks) {
            video = await this.videoEditor.createSubVideo(this.selectedItem, selectedChunks)
        }
        return video
    }

    ready(){
        super.ready();
        this.$.clear.onclick = () => {
            this.$.mediaPlayer.clearMarkers();
        };

        this.$.addMarker.onclick = () => {
            const marker = {time: 10, duration:10};
            this.$.mediaPlayer.addMarker(marker)
        };
    }
    private hiddenChange(hidden?: boolean){
        if(typeof (hidden) == 'boolean' && hidden){
            if(this.$.mediaPlayer){
                this.$.mediaPlayer.set('hidden', true)
            }
        }
    }
}

