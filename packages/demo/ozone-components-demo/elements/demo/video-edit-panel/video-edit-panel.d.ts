import "polymer/polymer-element.html";
import "paper-item/paper-item.html";
import "paper-button/paper-button.html";
import "iron-flex-layout/iron-flex-layout.html";
import './video-edit-panel.html';
import { Video, FromOzone } from 'ozone-type';
import 'ozone-api-edit-video';
import { OzoneApiEditVideo } from 'ozone-api-edit-video';
import 'ozone-video-player';
import { OzoneVideoPlayer } from 'ozone-video-player';
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
export declare class VideoEditPanel extends Polymer.Element {
    $: {
        mediaPlayer: OzoneVideoPlayer;
        addMarker: HTMLElement;
        clear: HTMLElement;
        selectType: HTMLElement;
    };
    /**
     * Item to edit
     */
    selectedItem: FromOzone<Video>;
    markersJson: string;
    markers: object;
    private _videoEditor?;
    get videoEditor(): OzoneApiEditVideo;
    subtitles: Array<string>;
    static get properties(): {
        selectedItem: {
            type: ObjectConstructor;
        };
        display: {
            type: BooleanConstructor;
            value: boolean;
        };
        markers: {
            type: ArrayConstructor;
        };
        markersJson: {
            type: StringConstructor;
        };
        subtitles: {
            type: ArrayConstructor;
        };
        subtitleSelect: {
            type: StringConstructor;
            value: string;
        };
        hidden: {
            type: BooleanConstructor;
            value: boolean;
            observer: string;
        };
    };
    static get observers(): string[];
    private markersChange;
    private _closePanel;
    private _save;
    ready(): void;
    private hiddenChange;
}
