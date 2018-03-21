declare module 'hls-parser' {
    export type Playlist = {
        segments: Array<{
            uri: string,
            duration: number,
            title: string,
            byterange: string,
            discontinuity: boolean,
            mediaSequenceNumber: number,
            discontinuitySequence: number,
            [key: string]: any,
        }>,
        [key: string]: any,
    }

    export function parse(str: string): Playlist;

    export function stringify(playlist: Playlist): string;
}