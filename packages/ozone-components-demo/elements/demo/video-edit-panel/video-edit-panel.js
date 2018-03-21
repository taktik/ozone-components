var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "polymer/polymer-element.html";
import "paper-item/paper-item.html";
import "paper-button/paper-button.html";
import "iron-flex-layout/iron-flex-layout.html";
import './video-edit-panel.html';
import { customElement, domElement } from 'taktik-polymer-typescript';
import 'ozone-api-edit-video';
import { OzoneApiEditVideo } from 'ozone-api-edit-video';
import 'ozone-video-player';
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
let VideoEditPanel = class VideoEditPanel extends Polymer.Element {
    get videoEditor() {
        if (!this._videoEditor)
            this._videoEditor = new OzoneApiEditVideo();
        return this._videoEditor;
    }
    static get properties() {
        return {
            selectedItem: {
                type: Object,
            },
            display: {
                type: Boolean,
                value: false,
            },
            markers: {
                type: Array,
            },
            markersJson: {
                type: String,
            },
            subtitles: {
                type: Array,
            },
            subtitleSelect: {
                type: String,
                value: 'en'
            },
            hidden: {
                type: Boolean,
                value: false,
                observer: 'hiddenChange'
            },
        };
    }
    static get observers() {
        return ['markersChange(markers.*)'];
    }
    markersChange(markers) {
        this.set('markersJson', JSON.stringify(this.markers));
    }
    _closePanel() {
        this.dispatchEvent(new CustomEvent('close-tap', { bubbles: true }));
    }
    _save() {
        return __awaiter(this, void 0, void 0, function* () {
            let selectedChunks = this.$.mediaPlayer.getSelectedChunks(true);
            console.log('newVideo', selectedChunks);
            let video = null;
            if (selectedChunks) {
                video = yield this.videoEditor.createSubVideo(this.selectedItem, selectedChunks);
            }
            return video;
        });
    }
    ready() {
        super.ready();
        this.$.clear.onclick = () => {
            this.$.mediaPlayer.clearMarkers();
        };
        this.$.addMarker.onclick = () => {
            const marker = { time: 10, duration: 10 };
            this.$.mediaPlayer.addMarker(marker);
        };
    }
    hiddenChange(hidden) {
        if (typeof (hidden) == 'boolean' && hidden) {
            if (this.$.mediaPlayer) {
                this.$.mediaPlayer.set('hidden', true);
            }
        }
    }
};
__decorate([
    domElement(),
    __metadata("design:type", Object)
], VideoEditPanel.prototype, "$", void 0);
VideoEditPanel = __decorate([
    customElement('video-edit-panel')
], VideoEditPanel);
export { VideoEditPanel };
