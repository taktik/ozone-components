/**
 * Created by hubert on 23/06/17.
 */
import 'polymer/polymer-element.html';
import './ozone-media-edit.html';
import { Item } from 'ozone-type';
import { SizeEnum } from 'ozone-media-url';
import { OzoneItemEdit } from 'ozone-item-edit';
import 'ozone-item-edit';
import 'ozone-video-player';
import { OzoneVideoPlayer } from 'ozone-video-player';
/**
 * <ozone-media-edit> is an element that provide material design to edit an media Item.
 *
 * ```html
 *  <link rel="import" href="../ozone-media-edit/ozone-media-edit.html">
 *      ...
 *  <ozone-media-edit item-data={{item}}>  </ozone-media-edit>
 * ```
 */
export declare class OzoneMediaEdit extends Polymer.Element {
    /**
     * item to display
     */
    itemData: Item | null;
    /**
     * Returns true if the value is invalid.
     */
    invalid: boolean;
    /**
     * hide element and pause the player.
     */
    hidden: boolean;
    isVideo: boolean;
    playerElement?: OzoneVideoPlayer;
    $: {
        itemEdit: OzoneItemEdit;
        player: OzoneVideoPlayer;
    };
    dataChange(data: Item): Promise<void>;
    loadVideo(data?: Item): Promise<void>;
    loadImage(data?: Item, size?: SizeEnum): Promise<void>;
    private hiddenChange;
    private removeEntryIfExist;
}
