import "polymer/polymer-element.html";
import './ozone-video-player.html';
import * as Config from 'ozone-config';
import * as Clappr from 'Clappr';
import * as ClapprMarkersPlugin from 'clappr-markers-plugin';
import { MarkerOnVideo } from './clappr-marker';
import { Video } from 'ozone-type';
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
export declare class OzoneVideoPlayer extends Polymer.Element {
    /**
     * Clappr player element
     */
    player: Clappr.Player | undefined;
    /**
     * Url to play a video directly
     */
    videoUrl?: string;
    /**
     * Ozone video to play
     */
    video?: Video;
    /**
     * hide element and pause the player.
     */
    hidden: boolean;
    /**
     * Array of video markers
     */
    markers: Array<MarkerOnVideo>;
    /**
     * List of subtitles languages avaliable
     */
    subtitlesAvailable: Array<string>;
    /**
     * selected subtitle language
     */
    subtitleSelected?: string;
    /**
     * default parameters apply to Clapper Player
     */
    defaultClapprParameters: Clappr.ClapprParam;
    private OzoneMediaUrl;
    private _markerFactory?;
    private readonly markerFactory;
    private _subtitles;
    private _intervalReporter?;
    $: {
        player: HTMLElement;
    } | undefined;
    static readonly observers: string[];
    markersChange(): void;
    subtitleSelectedChange(subtitle?: string): Promise<void>;
    addConfigSubtitle(video: Video, config: Config.ConfigType): Clappr.ClapprParam;
    private _updateSubtitlesAvailable(video);
    /**
     * Load video from Ozone.
     * @param {Video} data
     * @return {Promise<void>}
     */
    loadOzoneVideo(data?: Video): Promise<void>;
    private _loadOzoneVideo(data?);
    /**
     * Load a video from an url.
     * @param {string} url
     * @return {Promise<void>}
     */
    loadVideoUrl(url: string): Promise<void>;
    private intervalReporter;
    reportUsage(): void;
    createPlayer(param: Clappr.ClapprParam): void;
    private visibilityChange();
    private videoUrlChange(url?);
    private videoChange(video?);
    destroy(): void;
    buildMarker(marker: MarkerOnVideo, index: number): ClapprMarkersPlugin.CropMarker;
    addMarker(videoMarker: MarkerOnVideo): void;
    removeMarker(id: number): void;
    clearMarkers(): void;
    getSelectedChunks(updateToFitHlsChunk?: boolean): Array<Array<string>> | null;
}
