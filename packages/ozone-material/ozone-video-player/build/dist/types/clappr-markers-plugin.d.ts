declare module 'clappr-markers-plugin' {
    class Marker {
        constructor(...param: Array<any>);
        getEmitter(): EventEmitter;
        notifyTimeChanged(): void;
        notifyTooltipChanged(): void;
        getTime(): number;
        getMarkerEl(): HTMLElement;
        getTooltipEl(): HTMLElement;
        onDestroy(): void;
        private initAttributes();
    }
    class BaseMarker extends Marker {
    }
    class StandardMarker extends BaseMarker {
    }
    class CropMarker extends BaseMarker {
        _$marker: HTMLElement;
        /**
         *   Returns the duration (in seconds) that this marker represents.
         */
        getDuration(): number;
        /**
         * Set the duration (in seconds) that this marker should represents.
         */
        setDuration(duration: number): void;
        /**
         *   Returns the time (in seconds) that this marker represents.
         */
        getTime(): number;
        /**
         * Set the time (in seconds) that this marker should represents.
         */
        setTime(duration: number): void;
        render(): void;
        _buildMarkerEl(): HTMLElement;
        _updateDurationValueFromCss(): void;
        _updateTimeFromCss(): void;
        getHlsFragments(updateToFitHlsChunk: boolean): Array<string>;
    }
    interface MarkersPluginType {
        readonly Marker: Marker;
        readonly StandardMarker: StandardMarker;
        readonly CropMarker: {
            new (time: number, duration: number): CropMarker;
        };
        readonly name: string;
        readonly attributes: {
            'class': string;
        };
        constructor(core: any): any;
        bindEvents(): void;
        addMarker(marker: Marker): void;
        removeMarker(marker: Marker): void;
        clearMarkers(): void;
        getAll(): Array<Marker>;
        getByIndex(index: number): Marker;
        render(): void;
        destroy(): void;
    }
    type EventEmitter = object;
}
