import { expect } from 'chai'
import { OzoneMediaUrl, OzonePreviewSize } from '../src/ozone-media-url'
import { FlowrVideoEnum } from 'ozone-config'

describe('tool OzoneMediaUrl', function() {
	let config = '/ozone'

	describe('constructor', function() {
		it('should set config and id', (done) => {
			const element = new OzoneMediaUrl('an_id', 'host')
			expect(element.id).to.equal('an_id')
			expect((element as any).ozoneHost).to.deep.equal('host')
			done()
		})
	})
	describe('getPreviewUrlJpg', function() {
		it('should put the id in the url', (done) => {
			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config)
			expect(element.getPreviewUrlJpg(1500)).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006030/org.taktik.filetype.image.preview.1500')
			done()
		})

		it('should work with enum', (done) => {
			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config)
			expect(element.getPreviewUrlJpg(OzonePreviewSize.Small)).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006030/org.taktik.filetype.image.preview.250')
			done()
		})
	})
	describe('getPreviewUrlPng', function() {
		it('should put the id in the url', (done) => {
			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config)
			expect(element.getPreviewUrlPng(1500)).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006030/preview.png.1500')
			done()
		})

		it('should work with enum', (done) => {
			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config)
			expect(element.getPreviewUrlPng(OzonePreviewSize.Small)).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006030/preview.png.250')
			done()
		})
	})

	describe('getVideoUrl', function() {
		it('should return video url', function(done) {

			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006028', config)
			expect(element.getVideoUrl(FlowrVideoEnum.flowr)).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006028/org.taktik.filetype.flowr.video/index.m3u8')
			done()
		})
	})
	describe('getVideoUrlMp4', function() {
		it('should return video url', function(done) {

			const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006028', config)
			expect(element.getVideoUrlMp4()).to.equal('/ozone/view/00000000-046c-7fc4-0000-000000006028/org.taktik.filetype.video.mp4')
			done()
		})
	})
	describe('createMediaDownloadForm', function() {
		it('should post the ids in the body', function(done) {
			const ids = ['00000000-046c-7fc4-0000-000000006028', 'c5d2d737-64d8-483b-ac1c-a969e90661be']
			const form = OzoneMediaUrl.createMediaDownloadForm(ids, config + '/')
			expect(form.method).to.equal('post')
			expect(form.getAttribute('action')).to.equal('/ozone/media')
			expect((form.elements.namedItem('medias') as HTMLInputElement).value).to.equal('00000000-046c-7fc4-0000-000000006028,c5d2d737-64d8-483b-ac1c-a969e90661be')
			expect((form.elements.namedItem('types') as HTMLInputElement).value).to.equal('org.taktik.filetype.original')
			done()
		})
	})
})
