
declare module 'clappr-markers-plugin' {


    export class Marker {

        constructor(...param: Array<any>)

        /*
         * Get the event emitter.
         * Used by the plugin and notifyTooltipChanged() method
         */
        getEmitter(): EventEmitter;

        /*
         * Call this to notify the plugin that the time of the marker
         * has changed so that it's position can be recalculated and changed
         * if necessary.
         */
        notifyTimeChanged(): void

        /*
         * Call this to notify the plugin that the contents of the tooltip
         * has changed so that it's position will be recalculated and changed
         * if necessary.
         */
        notifyTooltipChanged(): void

        /*
         * Should return the time (in seconds) that this marker represents.
         */
        getTime(): number

        /*
         * Should return the dom element which should represent the marker.
         * It will be inserted onto the seek bar and kept at the correct location.
         */
        getMarkerEl(): HTMLElement

        /*
         * Should return the dom element which is the tool tip,
         * or null if there is no tool tip for this marker.
         *
         * The tooltip will placed above the marker element, inside a container,
         * and this containers position will be managed for you.
         */
        getTooltipEl(): HTMLElement

        /*
         * Called when the marker is removed.
         */
        onDestroy(): void

        private initAttributes(): void
    }

    export class BaseMarker extends Marker {
    }

    export class StandardMarker extends BaseMarker {
    }

    export class CropMarker extends BaseMarker {

        public _$marker: HTMLElement;

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

        render(): void

        _buildMarkerEl(): HTMLElement;

        _updateDurationValueFromCss(): void

        _updateTimeFromCss(): void

        getHlsFragments(updateToFitHlsChunk: boolean): Array<string>;
    }

    export interface MarkersPluginType {

        readonly Marker: Marker;

        readonly StandardMarker: StandardMarker;

        readonly CropMarker: { new (time: number, duration: number): CropMarker };


        // backwards compatibility


        readonly name: string;

        readonly attributes: { 'class': string };

        constructor(core: any): any

        bindEvents(): void

        /*
         * Add a new marker.
         */
        addMarker(marker: Marker): void;

        /*
         * Remove a marker which has previously been added.
         * Returns true if the marker was removed, false if it didn't exist.
         */
        removeMarker(marker: Marker): void;


        /*
         * Clear all existing markers
         */
        clearMarkers(): void;

        /*
         * Get all markers
         */
        getAll(): Array<Marker>;

        /*
         * Get marker by index. Can be used with removeMarker() to remove a marker by index.
         */
        getByIndex(index: number): Marker

        render(): void;

        destroy(): void;

    }

    export type EventEmitter = object;
}
