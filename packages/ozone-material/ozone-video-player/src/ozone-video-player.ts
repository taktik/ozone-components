import "polymer/polymer-element.html"
import './ozone-video-player.html';
import * as Config from 'ozone-config';
import {customElement, property} from 'taktik-polymer-typescript'
import * as Clappr from 'Clappr'
import * as ClapprMarkersPlugin from 'clappr-markers-plugin'
import * as ClapprSubtitle from './Clappr-Subtitle'
import {ClapprMarkerFactory, MarkerOnVideo} from './clappr-marker'
import {OzoneMediaUrl, OzonePreviewSize, SizeEnum} from 'ozone-media-url'
import {Video} from 'ozone-type'
import{ozoneApiMediaplay, ReportInterval_ms} from './ozone-api-mediaplay'
import {WCMediaControl} from './MediaControl'
/**
 * `<ozone-video-player>`
 *
 * Customisable Ozone video player. Package in a webComponents and written in typeScript
 *
 *
 * ### Styling
 *
 * The following custom css mixin properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--marker-bar-background` | Background color of the marker's bar | `rgba(29,38,43,0.52)`
 * `--resizer-color` | Background color of the resizer | `rgba(29,38,43,0.9)`
 * `--resizer-handle-color` | Background color of the resizer's handle | `rgba(255,255,255,0.2)`
 * `--marker-bar` | Mixin applied to the marker's bar| {}
 * `--resizer` | Mixin applied to the marker's bar| {}
 * `--moving-tooltip-background-color` | Background color of the moving tooltip | `rgba(29,38,43,0.9)`
 * `--moving-tooltip-text-color` | Text color of the moving tooltip | `white`
 * `--moving-tooltip-mixin` | Mixin applied to the marker's bar| {}
 * `--subtiltes-color` | Color of the subtitles | `#fffb00`
 * `--subtitles-font-size` | Font size of the subtiltes | `16px`
 * `--subtitles-weight` | Font weight of the subtitles | `bold`
 * `--subtitles-font-family` | Font family of the subtitles | `'Roboto'`
 * `--subtitles` | Mixin applied to the subtitles and the subtitles' container | {}
 */
@customElement('ozone-video-player')
export class OzoneVideoPlayer extends Polymer.Element{

    /**
     * Clappr player element
     */
    @property({type: Object})
    public player: Clappr.Player | undefined;

    /**
     * Url to play a video directly
     */
    @property({type: String, observer: 'videoUrlChange'})
    public videoUrl?: string;

    /**
     * Ozone video to play
     */
    @property({type: Object, observer: 'videoChange'})
    public video?: Video;

    /**
     * hide element and pause the player.
     */
    @property({type: Boolean, observer: 'visibilityChange'})
    public hidden: boolean = false;

    /**
     * Array of video markers
     */
    @property({type:Array, notify: true})
    public markers: Array<MarkerOnVideo> = [];

    /**
     * List of subtitles languages avaliable
     */
    @property({type:Array, notify: true,})
    public subtitlesAvailable: Array<string> = [];

    /**
     * selected subtitle language
     */
    @property({type: String, observer: 'subtitleSelectedChange'})
    public subtitleSelected?: string;

    /**
     * default parameters apply to Clapper Player
     */
    public defaultClapprParameters: Clappr.ClapprParam = {

        plugins: {
            core: [ClapprMarkersPlugin, ClapprSubtitle.ClapprSubtitle],
        },
        markersPlugin: {
            markers: [],
        },
        subtitle :{
            auto : true, // automatically loads subtitle
            backgroundColor : 'transparent',
            fontWeight : 'normal',
            fontSize : '14px',
            color: 'yellow',
            textShadow : '1px 1px #000'
        },
        mediacontrol: { external: WCMediaControl },
    };

    private OzoneMediaUrl= OzoneMediaUrl; //Exposed for testing purpose

    private _markerFactory?: ClapprMarkerFactory;
    private get markerFactory(): ClapprMarkerFactory{
        if(! this._markerFactory)
            this._markerFactory = new ClapprMarkerFactory(this);
        return this._markerFactory;
    }
    private _subtitles: Map<string, object> = new Map();


    private _intervalReporter?:number;


    $:{
        player: HTMLElement
    } | undefined;

    static get observers(){
        return ['markersChange(markers.*)'];
    }

    markersChange(){
    }

    async subtitleSelectedChange(subtitle?:string){
        if(subtitle && this.player && this.video && this.video.subTitle){
            const config = await (Config.OzoneConfig.get());
            const mediaUrl = new this.OzoneMediaUrl(this.video.subTitle[subtitle] as string, config);
            if(this.player.options.subtitle) {
                const plugin = this.player.getPlugin('subtitle-plugin');
                plugin.options.src = mediaUrl.getOriginalFormat()

                plugin.initSubtitle();
            }
        }

    }

    addConfigSubtitle(video:Video, config:Config.ConfigType){

        if(this.subtitleSelected && this._subtitles.has(this.subtitleSelected) && video.subTitle ) {

            const mediaUrl = new this.OzoneMediaUrl(video.subTitle[this.subtitleSelected] as string, config);
            this.defaultClapprParameters.subtitle.src = mediaUrl.getOriginalFormat();
        } else {

            this.defaultClapprParameters.subtitle.src = null
        }
        return this.defaultClapprParameters

    }
    private _updateSubtitlesAvailable(video:Video ){
        if(video.subTitle){
            for(let s in  video.subTitle){
                this._subtitles.set(s, video.subTitle[s] as any)
                this.push('subtitlesAvailable',s);
            }
        } else{
            this._subtitles.clear();
            this.set('subtitlesAvailable', [])
        }
    }
    /**
     * Load video from Ozone.
     * @param {Video} data
     * @return {Promise<void>}
     */
    public async loadOzoneVideo(data?: Video){
        if (data) {
            this.video = data;
        }
    }

    private async _loadOzoneVideo(data?: Video){

        const config = await (Config.OzoneConfig.get());


        if(data) {
            this.video = data;
            this._updateSubtitlesAvailable(data);
            const mediaUrl = new this.OzoneMediaUrl(data.id as string, config);
            const url = await mediaUrl.getVideoUrl();
            let previewImage = mediaUrl.getPreviewUrlJpg(OzonePreviewSize.Medium);
            if(data.logo){
                const previewUrl = new this.OzoneMediaUrl(data.logo, config);
                previewImage = previewUrl.getPreviewUrlJpg(OzonePreviewSize.Medium);
            }

            const clapprConfig = this.addConfigSubtitle(data, config)

            const param: Clappr.ClapprParam = Object.assign({
                source: url,
                poster: previewImage,
            }, clapprConfig);
            param.subtitle.list = this._subtitles;
            this.createPlayer(param);

            this.intervalReporter = window.setInterval(()=>{
                this.reportUsage();
            }, ReportInterval_ms);
        }
    }



    /**
     * Load a video from an url.
     * @param {string} url
     * @return {Promise<void>}
     */
    public async loadVideoUrl(url: string){

        const param: Clappr.ClapprParam = Object.assign({
            source: url,
        }, this.defaultClapprParameters);
        this.createPlayer(param);
    }

    private set intervalReporter(interval:number| undefined){
        if (this._intervalReporter){
            clearInterval(this._intervalReporter);
        }
        this._intervalReporter = interval;
    }
    private get intervalReporter ():number | undefined {
        return this._intervalReporter;
    }

    reportUsage(){
        if(this.video && this.player && this.player.isPlaying())
            ozoneApiMediaplay.reportMediaUsage(this.video);
    }

    createPlayer(param: Clappr.ClapprParam){
        this.destroy();
        this.player = new Clappr.Player(param);
        var playerElement = document.createElement('div');
        if(this.$)
        this.$.player.appendChild(playerElement);
        this.player.attachTo(playerElement);

        this.player.on(Clappr.Events.PLAYER_PLAY, ()=> {
            this.reportUsage();
        })
    }

    private visibilityChange(){
        if(this.hidden && this.player){
            this.player.pause();
        }
    }

    private videoUrlChange(url? : string){
        if (url){
            this.loadVideoUrl(url);
        }
    }
    private videoChange(video? : Video){
        if (video){
            this._loadOzoneVideo(video);
        }
    }

    public destroy():void{
        this.set('markers',[]);
        if(this.player){
            this.player.destroy();
        }
        this.intervalReporter = undefined;
    }

    buildMarker(marker: MarkerOnVideo, index: number): ClapprMarkersPlugin.CropMarker{
        return this.markerFactory.createMarker(marker, index);
    }

    addMarker(videoMarker: MarkerOnVideo) {
        if (this.player) {
            this.push('markers', videoMarker);
            const aMarker = this.buildMarker(videoMarker, this.markers.length -1);
            const markersPlugin = this.player.getPlugin('markers-plugin') as ClapprMarkersPlugin.MarkersPluginType;
            markersPlugin.addMarker(aMarker);
            if(this.$)
            this.$.player.getElementsByClassName("media-control-layer")[0].classList.add("edit-mode");
        }
    };

    removeMarker(id: number) {
        if (this.player) {
            const markersPlugin = this.player.getPlugin('markers-plugin') as ClapprMarkersPlugin.MarkersPluginType;
            const marker = markersPlugin.getByIndex(id);
            markersPlugin.removeMarker(marker);
            this.splice('markers', id, 1);
        }
    };

    clearMarkers() {
        if (this.player) {
            const markersPlugin = this.player.getPlugin('markers-plugin') as ClapprMarkersPlugin.MarkersPluginType;
            markersPlugin.clearMarkers();
            this.set('markers',[]);
            if(this.$)
            this.$.player.getElementsByClassName("media-control-layer")[0].classList.remove("edit-mode");

        }
    };

    getSelectedChunks(updateToFitHlsChunk=false):Array<Array<string>> | null{
        if (this.player) {
            const markersPlugin = this.player.getPlugin('markers-plugin') as ClapprMarkersPlugin.MarkersPluginType;
            return markersPlugin.getAll()
                .map((marker, index) => {
                    const markerC = marker as ClapprMarkersPlugin.CropMarker;
                    const selectedChunks = markerC.getHlsFragments(updateToFitHlsChunk);
                    if(updateToFitHlsChunk) {
                        this.set(`markers.${index}.duration`, markerC.getDuration());
                        this.set(`markers.${index}.time`, markerC.getTime());
                    }
                    return selectedChunks;
                })
        }
        return null;
    }
}

