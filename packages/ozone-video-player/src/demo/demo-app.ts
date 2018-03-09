import "polymer/polymer.html";
import './demo-app.html';
import {customElement} from 'taktik-polymer-typescript'
import {OzoneVideoPlayer} from "../ozone-video-player"

@customElement('demo-app')
class demoApp extends Polymer.Element {

    $: {
        mediaPlayer: OzoneVideoPlayer,
        addMarker: Element,
        clear: Element,
        loadUrl: Element,
        loadOzoneSub: Element,
    };
    videoUrl: string;
    static get properties() {
        return {
            aVideo: {
                type: Object,
            },
            subtitles: {
                type: Object,
            },
            markers: {
                type: Array,
            },
            subtitleSelect: {
                type: String,
            },
            videoUrl: {
                type: String,
                value: "test/data/3/org.taktik.filetype.video.hls/index.m3u8"
            },
            display: {
                type: Boolean,
                value: false,
            }
        };
    }

    ready() {
        super.ready();
        this.$.addMarker.addEventListener('click', e => this._addMarker());
        this.$.clear.addEventListener('click', e => this._clearMarkers());
        this.$.loadUrl.addEventListener('click', e => this._loadUrl());
        this.$.loadOzoneSub.addEventListener('click', e => this._loadOzoneVideo())
    }

    _addMarker(){
        this.$.mediaPlayer.addMarker({duration:  10, time: 10});
    }
    _clearMarkers(){
        this.$.mediaPlayer.clearMarkers();
    }
    _loadUrl(){
        this.$.mediaPlayer.loadVideoUrl(this.videoUrl);
    }
    _loadOzoneVideo(){
        this.$.mediaPlayer.loadOzoneVideo({
            id: '00000000-0000-0000-0000-000000000003',
            type:'video',
            subtitles:{ "English": "00000000-0000-0000-0000-000000000002","Polish": "00000000-0000-0000-0000-000000000001" },
        });
    }



}