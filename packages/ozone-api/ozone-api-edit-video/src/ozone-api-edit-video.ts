
import {jsElement} from 'taktik-polymer-typescript'
import {OzoneMediaUrl} from 'ozone-media-url'
import * as Config from 'ozone-config';
import * as OzoneType from 'ozone-type'
import {OzoneApiItem} from 'ozone-api-item'
import {SearchQuery} from 'ozone-search-helper'
import {OzoneAPIRequest} from 'ozone-api-request'

import * as HLS from 'hls-parser'

export type Blob = {
    creationDate: string,
    hashMd5: string,
    id: uuid,
    size: number,
    status: string,
    storageUnitId: uuid,

}

export declare class VideoArea {
    time: number;
    duration:number
}
export declare type VideoMarker = Array<VideoArea>

/**
 * ozone-api-edit-video
 *
 * ES6 module to save selected video chunk
 *
 *
 * # Usage
 *
 * ```javaScript
 * import {OzoneApiEditVideo} from 'ozone-api-edit-video'
 * const ozoneApiEditVideo =  new OzoneApiEditVideo();
 *
 * // TODO get originalVideo from ozone-api-item
 * // TODO get selectedChunks from ozone-video-player
 *
 * ozoneApiEditVideo
 *    .createSubVideo(originalVideo, selectedChunks)
 *    .then((video) => {
 *       console.log('new video created with id', video.id)
 *    });
 * ```
 *
 *
 */
@jsElement()
export class OzoneApiEditVideo {

    ozoneApi: OzoneApiItem;
    private _ozoneMediaUrlCollection : Map<string, OzoneMediaUrl> =  new Map();

    private async mediaUrlFactory(video: OzoneType.Video): Promise<OzoneMediaUrl>{
        if(video.id && this._ozoneMediaUrlCollection.has(video.id)){
            return this._ozoneMediaUrlCollection.get(video.id) as OzoneMediaUrl;
        } else {
            const config = await (Config.OzoneConfig.get());
            const ozoneMediaUrl = new OzoneMediaUrl(video.id as string, config);
            this._ozoneMediaUrlCollection.set(video.id as string, ozoneMediaUrl);
            return ozoneMediaUrl;
        }
    }


    constructor(){
        this.ozoneApi = new OzoneApiItem();
    }

    private async _createNewPlayListFile(originalVideo: OzoneType.Video, chunksList: Array<Array<string>>):Promise<string>{
        const chunksListFlatten :Array<string> = [].concat.apply([],chunksList);
        const mediaUrl = await this.mediaUrlFactory(originalVideo);
        const url = await mediaUrl.getVideoUrl();
        const request = new OzoneAPIRequest();
        request.responseType= 'text';
        request.url = url;
        const data = (await request.sendRequest()).response;
        const playList = HLS.parse(data.toString());
        playList.segments = playList.segments.filter((segment)=>{
            const chunkToKeep = chunksListFlatten.find((v)=>v == segment.uri);
            return typeof (chunkToKeep) !== "undefined";
        });
        for (let i = 1; i < chunksList.length; i++){
            const firstChunkName = chunksList[i][0];
            const discontinuityChunk = playList.segments.find((segment)=> {
                return segment.uri == firstChunkName;
            });

            if(discontinuityChunk){
                discontinuityChunk.discontinuity = true
            }
        }
        return HLS.stringify(playList);
    }

    private async _savePlayList(playList:string): Promise<object>{

        const config = await (Config.OzoneConfig.get());
        const url = config.host + config.endPoints.blob;

        const request = new OzoneAPIRequest();
        request.method = 'PUT';
        request.url = url;
        request.body = playList;
        return (await request.sendRequest()).response;

    }

    private async _createBlobFile(playListBlob: Blob){

        const blobFile: OzoneType.File = {
            blob: playListBlob.id,
            uti: 'unofficial.m3uu-playlist',
            type: 'file'
        };
        return await this.ozoneApi.on('file').create(blobFile);
        
    }
    private async getVideoFile(originalVideo: OzoneType.Video): Promise<OzoneType.File>{

        if(originalVideo.derivedFiles) {
            const mediaUrl = await this.mediaUrlFactory(originalVideo);
            const fileTypeIdentifier = await mediaUrl.getPreferedVideoFormat();
            debugger
            if( typeof fileTypeIdentifier !== 'string')
                throw new Error('No video files found')
            const fileType = await this.getFileType(fileTypeIdentifier);

            const query = new SearchQuery();
            query.termQuery('fileType', fileType.id as string)
                .and.idsQuery(...originalVideo.derivedFiles);

            const serachGen = await this.ozoneApi.on('file').search(query);
            const serachResult = await serachGen.next();
            if(serachResult){
                const originalHLSFile =  serachResult.results[0];
                const file = await this.ozoneApi.on('file').getOne(originalHLSFile.id as uuid);
                return file as OzoneType.File;
            } else {
                throw new Error('Unable to find original File')
            }

        } else {
            throw new Error('originalVideo has no file')
        }


    }

    private async getFileType (type:string): Promise<OzoneType.FileType>{
        const config = await (Config.OzoneConfig.get());
        let identifier = type;
        if(config.format.type[type]){
            identifier = config.format.type[type];
        }
        const url = `${config.host}${config.endPoints.fileType}/identifier/${identifier}`;
        //No senses to do this work by chance on flowr
        // should be the format of the video under edition

        const request = new OzoneAPIRequest();
        request.url = url;

        return ((await request.sendRequest()).response) as OzoneType.FileType;
    }
    private async _createFolder(playListFile: OzoneType.File,
                                originalVideoFile: OzoneType.File,
                                chunks: Array<string>,
                                originaFileTypeIdentifier:string): Promise<OzoneType.File>{
        const config = await (Config.OzoneConfig.get());
        if(originalVideoFile.subFiles) {
            const subFiles = originalVideoFile.subFiles
            const newSubFile: any = {"index.m3u8": playListFile.id};
            chunks.forEach((chunk) => {
                if(subFiles[chunk])
                    newSubFile[chunk] = subFiles[chunk]
            });
            const originalFileType = (await this.getFileType(originaFileTypeIdentifier));
            console.log('originalFileType', originalFileType,  originaFileTypeIdentifier)
            const newFolder: OzoneType.File = {
                type: "file",
                uti: "public.folder",
                fileType: originalFileType.id as string,
                subFiles: newSubFile,

            };
            return (await this.ozoneApi.on('file').create(newFolder)) as OzoneType.File
        } else {
            throw new Error('Video file has no subFile')
        }

    }
    private async _duplicateVideo(originalVideo: OzoneType.Video, newFolder: OzoneType.File): Promise<OzoneType.Video>{

        const newVideo = JSON.parse(JSON.stringify(originalVideo)) as OzoneType.Video; //deep copy
        const now = (new Date()).toISOString() as OzoneType.Date;

        delete newVideo.id;
        delete newVideo.derivedFiles;
        delete newVideo.version;
        newVideo.file = newFolder.id;
        newVideo.creationDate = now;
        newVideo.modificationDate = now;
        newVideo.previewDate = now;

        return (await this.ozoneApi.on('video').create(newVideo)) as OzoneType.Video
    }

    public async createSubVideo(originalVideo: OzoneType.Video, chunks: Array<Array<string>>): Promise<OzoneType.Video> {
        //console.log('originalVideo', originalVideo)

        const chunksListFlatten :Array<string> = [].concat.apply([],chunks);
        const playListData =  await this._createNewPlayListFile(originalVideo, chunks);

        const  playListBlob = (await this._savePlayList(playListData)) as Blob;
        //console.log('playListBlob', playListBlob)
        
        //create new ozone file referencing  our playListBlob
        const playListFile = await this._createBlobFile(playListBlob)
        //console.log('playListFile', playListFile)

        const OriginalVideoFile = await this.getVideoFile(originalVideo);

        //console.log('OriginalVideoFile', OriginalVideoFile)

        const mediaUrl = await this.mediaUrlFactory(originalVideo);
        const originaFileTypeIdentifier = await mediaUrl.getPreferedVideoFormat();
        if( typeof originaFileTypeIdentifier !== 'string')
            throw new Error('No video files found')
        const newFolder = await this._createFolder(playListFile, OriginalVideoFile, chunksListFlatten, originaFileTypeIdentifier);
        //console.log('newFolder', newFolder)

        const newVideo = await this._duplicateVideo(originalVideo, newFolder);
        //console.log(newVideo)
        return newVideo;
    }
    /***/
}

