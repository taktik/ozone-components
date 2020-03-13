
import {OzoneMediaUrl, OzonePreviewSize, SizeEnum} from "../src/ozone-media-url.ts"
import {OzoneConfig} from "ozone-config"
describe('tool OzoneMediaUrl', function () {
    let config= '/ozone';

    describe('constructor', function () {
        it('should set config and id', (done)=>{
            const element = new OzoneMediaUrl('an_id', 'host');
            expect(element.id).to.equal('an_id');
            expect(element.ozoneHost).to.deep.equal('host');
            done()
        });
    });
    describe('getNumericId', function () {
        it('should convert id: "00000000-046c-7fc4-0000-000000006030" to 24624', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', 'host');
            expect(element.getNumericId()).to.equal(24624);
            done()
        });
    });
    describe('getPreviewUrlJpg', function () {
        it('should convert id: "00000000-046c-7fc4-0000-000000006030" to 24624', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config);
            expect(element.getPreviewUrlJpg(1500)).to.equal('/ozone/view/24624/org.taktik.filetype.image.preview.1500');
            done()
        });

        it('should work with enum', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config);
            expect(element.getPreviewUrlJpg(OzonePreviewSize.Small)).to.equal('/ozone/view/24624/org.taktik.filetype.image.preview.250');
            done()
        });
    });
    describe('getPreviewUrlPng', function () {
        it('should convert id: "00000000-046c-7fc4-0000-000000006030" to 24624', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config);
            expect(element.getPreviewUrlPng(1500)).to.equal('/ozone/view/24624/preview.png.1500');
            done()
        });

        it('should work with enum', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', config);
            expect(element.getPreviewUrlPng(OzonePreviewSize.Small)).to.equal('/ozone/view/24624/preview.png.250');
            done()
        });
    });

    describe('getVideoUrl', function () {
        it('should return video url', function (done){

            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006028', config);
            element._getVideoFileType = sinon.stub().withArgs().returns([{id:'fileType', identifier:'org.taktik.filetype.flowr.video'}]);
			expect(element.getVideoUrl()).to.equal('/ozone/view/24616/org.taktik.filetype.flowr.video/index.m3u8');
            done();
        });
    });
    describe('getVideoUrlMp4', function () {
        it('should return video url', function (done){

            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006028', config);
            expect(element.getVideoUrlMp4()).to.equal('/ozone/view/24616/org.taktik.filetype.video.mp4');
            done();
        });
    });
});
