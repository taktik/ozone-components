import * as Clappr from 'Clappr';
export declare class WCMediaControl extends Clappr.MediaControl {
    readonly events: {
        'click [data-play]': string;
        'click [data-pause]': string;
        'click [data-playpause]': string;
        'click [data-stop]': string;
        'click [data-playstop]': string;
        'click [data-fullscreen]': string;
        'click .bar-container[data-volume]': string;
        'click .drawer-icon[data-volume]': string;
        'mouseenter .drawer-container[data-volume]': string;
        'mouseleave .drawer-container[data-volume]': string;
        'mousedown .bar-container[data-volume]': string;
        'mousemove .bar-container[data-volume]': string;
        'mousedown .bar-container[data-seekbar]': string;
        'mouseenter .media-control-layer[data-controls]': string;
        'mouseleave .media-control-layer[data-controls]': string;
    };
    /***  Start seek control  ***/
    seek(event: MouseEvent): false | undefined;
    mousemoveOnSeekBar(event: MouseEvent): void;
    mouseleaveOnSeekBar(event: MouseEvent): void;
    stopDragHandler(): void;
    updateDragHandler(): void;
    startSeekDrag(event: MouseEvent): void;
    setPosition(pos: number): void;
    setTime(timeSec: number): void;
    /***  Start seek control  ***/
    show(event: MouseEvent): void;
    stopDrag(event: MouseEvent): void;
    hide(delay?: number): void;
    /***  Start audio control  ***/
    updateDrag(event: MouseEvent): void;
    getVolumeFromUIEvent(event: MouseEvent): number;
    _muted: boolean;
    _savedVolume: number | undefined;
    savedVolume: number;
    muted: boolean;
    toggleMute(): void;
    onVolumeClick(event: MouseEvent): void;
    mousemoveOnVolumeBar(event: MouseEvent): void;
    startVolumeDrag(event: MouseEvent): void;
}
