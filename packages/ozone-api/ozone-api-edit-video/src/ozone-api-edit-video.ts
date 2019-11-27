
import { OzoneMediaUrl } from 'ozone-media-url'
import * as OzoneType from 'ozone-type'
import { OzoneApiItem } from 'ozone-api-item'
import { SearchQuery } from 'ozone-search-helper'
import { OzoneAPIRequest } from 'ozone-api-request'
import { getDefaultClient } from 'ozone-default-client'
import { OzoneFormat } from 'ozone-config'

import * as HLS from 'hls-parser'

export type Blob = {
	creationDate: string,
	hashMd5: string,
	id: OzoneType.UUID,
	size: number,
	status: string,
	storageUnitId: OzoneType.UUID

}

export declare class VideoArea {
	time: number
	duration: number
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
export class OzoneApiEditVideo {

	private _ozoneMediaUrlCollection: Map<string, OzoneMediaUrl> = new Map()

	private async mediaUrlFactory(video: OzoneType.FromOzone<OzoneType.Video>): Promise<OzoneMediaUrl> {
		if (video.id && this._ozoneMediaUrlCollection.has(video.id)) {
			return this._ozoneMediaUrlCollection.get(video.id) as OzoneMediaUrl
		} else {
			const ozoneMediaUrl = new OzoneMediaUrl(video.id, getDefaultClient().config.ozoneURL)
			this._ozoneMediaUrlCollection.set(video.id, ozoneMediaUrl)
			return ozoneMediaUrl
		}
	}

	private async _createNewPlayListFile(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>,
		chunksList: ConcatArray<string>[]
	): Promise<string> {
		const chunksListFlatten: Array<string> = Array<string>().concat.apply([],chunksList)
		const mediaUrl = await this.mediaUrlFactory(originalVideo)
		const url = await mediaUrl.getVideoUrl()
		const request = new OzoneAPIRequest()
		request.responseType = 'text'
		request.url = url
		const data = (await request.sendRequest()).response
		const playList = HLS.parse(data.toString())
		playList.segments = playList.segments.filter((segment) => {
			const chunkToKeep = chunksListFlatten.find((v) => v === segment.uri)
			return typeof (chunkToKeep) !== 'undefined'
		})
		for (let i = 1; i < chunksList.length; i++) {
			const firstChunkName = chunksList[i][0]
			const discontinuityChunk = playList.segments.find((segment) => {
				return segment.uri === firstChunkName
			})

			if (discontinuityChunk) {
				discontinuityChunk.discontinuity = true
			}
		}
		return HLS.stringify(playList)
	}

	private async _savePlayList(playList: string): Promise<OzoneType.Blob> {

		const url = `${getDefaultClient().config.ozoneURL}/rest/v3/blob`

		const request = new OzoneAPIRequest()
		request.method = 'PUT'
		request.url = url
		request.body = playList
		return (await request.sendRequest()).response

	}

	private async _createBlobFile(playListBlob: OzoneType.Blob): Promise<OzoneType.File> {

		const blobFile: Partial<OzoneType.File> = {
			blob: playListBlob.id,
			uti: 'unofficial.m3uu-playlist',
			type: 'file'
		}
		const ozoneApi = new OzoneApiItem<OzoneType.File>()
		const file = await ozoneApi.on('file').create(blobFile)
		if (file) {
			return file
		} else {
			throw new Error('Unable to create file')
		}

	}
	private async getVideoFile(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>
	): Promise<OzoneType.FromOzone<OzoneType.File>> {

		if (originalVideo.derivedFiles) {
			const mediaUrl = await this.mediaUrlFactory(originalVideo)
			const fileTypeIdentifier = await mediaUrl.getPreferedVideoFormat()
			if (typeof fileTypeIdentifier !== 'string') {
				throw new Error('No video files found')
			}
			const fileType = await this.getFileType(fileTypeIdentifier)

			const query = new SearchQuery()
			query.termQuery('fileType', fileType.id as string)
				.and.idsQuery(originalVideo.derivedFiles)

			const ozoneApi = new OzoneApiItem<OzoneType.File>()
			const searchGen = await ozoneApi.on('file').search(query)
			const searchResult = await searchGen.next()
			if (searchResult && searchResult.results) {
				const originalHLSFile = searchResult.results[0]
				const file = await ozoneApi.on('file').getOne(originalHLSFile.id)
				if (file) {
					return file
				}
			}
			throw new Error('Unable to find original File')

		} else {
			throw new Error('originalVideo has no file')
		}

	}

	private async getFileType (type: string): Promise<OzoneType.FileType> {

		let identifier = type
		if (OzoneFormat.type[type]) {
			identifier = OzoneFormat.type[type]
		}
		const url = `${getDefaultClient().config.ozoneURL}/rest/v3/filetype/identifier/${identifier}`
		// No senses to do this work by chance on flowr
		// should be the format of the video under edition

		const request = new OzoneAPIRequest()
		request.url = url

		return ((await request.sendRequest()).response) as OzoneType.FileType
	}
	private async _createFolder(playListFile: OzoneType.File,
								originalVideoFile: OzoneType.File,
								chunks: Array<string>,
								originaFileTypeIdentifier: string): Promise<OzoneType.FromOzone<OzoneType.File>> {

		if (originalVideoFile.subFiles) {
			const subFiles = originalVideoFile.subFiles
			const newSubFile: any = { 'index.m3u8': playListFile.id }
			chunks.forEach((chunk) => {
				if (subFiles[chunk]) {
					newSubFile[chunk] = subFiles[chunk]
				}
			})
			const originalFileType = (await this.getFileType(originaFileTypeIdentifier))

			const newFolder: Partial<OzoneType.File> = {
				type: 'file',
				uti: 'public.folder',
				fileType: originalFileType.id as string,
				subFiles: newSubFile

			}
			const ozoneApi = new OzoneApiItem<OzoneType.File>()
			const folder = await ozoneApi.on('file').create(newFolder)
			if (folder) {
				return folder
			}
		}
		throw new Error('Video file has no subFile')

	}
	private async _duplicateVideo(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>,
		newFolder: OzoneType.File
	): Promise<OzoneType.Video> {

		const newVideo: Partial<OzoneType.Video> = JSON.parse(JSON.stringify(originalVideo)) as OzoneType.Video // deep copy
		const now = (new Date()).toISOString() as OzoneType.Date

		delete newVideo.id
		delete newVideo.derivedFiles
		delete newVideo.version
		newVideo.file = newFolder.id
		newVideo.creationDate = now
		newVideo.modificationDate = now
		newVideo.previewDate = now
		const ozoneApi = new OzoneApiItem<OzoneType.Video>()
		const result = (await ozoneApi.on('video').create(newVideo))
		if (result) {
			return result
		} else throw new Error('Unable to create Video')
	}

	public async createSubVideo(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>,
		chunks: Array<ConcatArray<string>>
	): Promise<OzoneType.Video> {
		// console.log('originalVideo', originalVideo)

		const chunksListFlatten: Array<string> = Array<string>().concat.apply([],chunks)
		const playListData = await this._createNewPlayListFile(originalVideo, chunks)

		const playListBlob = await this._savePlayList(playListData)
		// console.log('playListBlob', playListBlob)

		// create new ozone file referencing  our playListBlob
		const playListFile = await this._createBlobFile(playListBlob)
		// console.log('playListFile', playListFile)

		const OriginalVideoFile = await this.getVideoFile(originalVideo)

		// console.log('OriginalVideoFile', OriginalVideoFile)

		const mediaUrl = await this.mediaUrlFactory(originalVideo)
		const originaFileTypeIdentifier = await mediaUrl.getPreferedVideoFormat()
		if (typeof originaFileTypeIdentifier !== 'string') {
			throw new Error('No video files found')
		}
		const newFolder = await this._createFolder(playListFile, OriginalVideoFile, chunksListFlatten, originaFileTypeIdentifier)
		// console.log('newFolder', newFolder)

		const newVideo = await this._duplicateVideo(originalVideo, newFolder)
		// console.log(newVideo)
		return newVideo
	}
	/***/
}
