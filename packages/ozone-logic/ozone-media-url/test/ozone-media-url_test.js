
import "../src/ozone-media-url.ts"
import "ozone-config"
describe('tool OzoneMediaUrl', function () {
    let config;
    beforeEach((done)=>{
        OzoneConfig.get().then((ozoneConfig)=>{
            config = ozoneConfig;
            done();
        });
    });
    describe('constructor', function () {
        it('should set config and id', (done)=>{
            const element = new OzoneMediaUrl('an_id', {host:'ozone', view:'view'});
            expect(element.id).to.equal('an_id');
            expect(element.config).to.deep.equal({host:'ozone', view:'view'});
            done()
        });
    });
    describe('getNumericId', function () {
        it('should convert id: "00000000-046c-7fc4-0000-000000006030" to 24624', (done)=>{
            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006030', {host:'ozone', view:'/view'});
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
            const dummyOzoneApi = function(){
            this.on = ()=>{
                return this
            };
            this.getOne = (id) =>{
                expect(id).to.equal('00000000-046c-7fc4-0000-000000006028')
                return {id: '00000000-046c-7fc4-0000-000000006028', file: 'f1', derivedFiles: ['f2', 'f3']}
            };
            this.bulkGet = (ids) => {
                expect(ids).to.deep.equal(['f1', 'f2', 'f3'])
                return [{
                    fileType :'fileType'
                }]
            };
            return this;
            };

            const element = new OzoneMediaUrl('00000000-046c-7fc4-0000-000000006028', config);
            element.ozoneApi = new dummyOzoneApi();
            element._getVideoFileType = sinon.stub().withArgs().returns([{id:'fileType', identifier:'org.taktik.filetype.flowr.video'}]);
            element.getVideoUrl().then((url)=>{
                expect(url).to.equal('/ozone/view/24616/org.taktik.filetype.flowr.video/index.m3u8');
                done();
            });
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
