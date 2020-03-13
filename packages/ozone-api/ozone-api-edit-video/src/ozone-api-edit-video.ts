import * as OzoneType from 'ozone-type'
import { SearchQuery } from 'ozone-search-helper'
import { getDefaultClient } from 'ozone-default-client'
import { OzoneFormat } from 'ozone-config'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request
import * as HLS from 'hls-parser'
import { OzoneVideoUrl } from 'ozone-media-url'

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

	private _ozoneMediaUrlCollection = new Map<string, OzoneVideoUrl>()

	private async mediaUrlFactory(video: OzoneType.FromOzone<OzoneType.Video>): Promise<OzoneVideoUrl> {
		if (video.id && this._ozoneMediaUrlCollection.has(video.id)) {
			return this._ozoneMediaUrlCollection.get(video.id)!
		} else {
			const ozoneMediaUrl = new OzoneVideoUrl(video, getDefaultClient())
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
		const url = await mediaUrl.getPreferredVideoUrl()

		const request = new Request(url)
			.setMethod('GET')
		request.responseType = 'text'

		const data = await getDefaultClient().call<String>(request)
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
		const blobClient = getDefaultClient().blobClient()
		return blobClient.create(playList)
	}

	private async _createBlobFile(playListBlob: OzoneType.Blob): Promise<OzoneType.File> {

		const blobFile: Partial<OzoneType.File> = {
			blob: playListBlob.id,
			uti: 'unofficial.m3uu-playlist',
			type: 'file'
		}
		const fileItemClient = getDefaultClient().itemClient<OzoneType.File>('file')
		return fileItemClient.save(blobFile)
	}
	private async getVideoFile(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>
	): Promise<OzoneType.FromOzone<OzoneType.File>> {

		if (originalVideo.derivedFiles) {
			const mediaUrl = await this.mediaUrlFactory(originalVideo)
			const fileTypeIdentifier = await mediaUrl.getPreferredVideoFormat()
			if (typeof fileTypeIdentifier !== 'string') {
				throw new Error('No video files found')
			}
			const fileType = await this.getFileType(fileTypeIdentifier)

			const query = new SearchQuery()
			query.termQuery('fileType', fileType.id)
				.and.idsQuery(originalVideo.derivedFiles)

			const fileItemClient = getDefaultClient().itemClient<OzoneType.File>('file')
			const searchResult = await fileItemClient.search(query.searchRequest)
			if (searchResult && searchResult.results) {
				const file = searchResult.results[0]
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
		const fileTypeCache = await getDefaultClient().fileTypeClient().getFileTypeCache()
		const file = fileTypeCache.findByIdentifier(identifier)
		if (file) return file
		throw Error('identifier not found')
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
				fileType: originalFileType.id,
				subFiles: newSubFile

			}
			const fileApi = getDefaultClient().itemClient<OzoneType.File>('file')
			return fileApi.save(newFolder)
		}
		throw new Error('Video file has no subFile')

	}
	private async _duplicateVideo(
		originalVideo: OzoneType.FromOzone<OzoneType.Video>,
		newFolder: OzoneType.File
	): Promise<OzoneType.Video> {

		const newVideo: Partial<OzoneType.Video> = JSON.parse(JSON.stringify(originalVideo)) // deep copy
		const now = (new Date()).toISOString()

		delete newVideo.id
		delete newVideo.derivedFiles
		delete newVideo.version
		newVideo.file = newFolder.id
		newVideo.creationDate = now
		newVideo.modificationDate = now
		newVideo.previewDate = now
		const videoApi = getDefaultClient().itemClient<OzoneType.Video>('video')
		return videoApi.save(newVideo)
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
		const originaFileTypeIdentifier = await mediaUrl.getPreferredVideoFormat()
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
