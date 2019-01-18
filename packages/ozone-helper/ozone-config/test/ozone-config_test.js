  import {OzoneConfig} from '../src/ozone-config.ts';

  describe('ozone-config tests', function() {
    let afterFunctions = [],
      server,
      responseHeaders = {json: {'Content-Type': 'application/json'}};

    beforeEach((done) => {
      server = sinon.fakeServer.create();
      flush(done);
    });
    afterEach(() => {
      afterFunctions.map((cleanup) => {
        cleanup()
      });
      afterFunctions = [];
    });
    it('should request ozone config file and expose config in configPromise', (done) => {
      // -- Configure mock server
      server.respondWith(
        'GET',
        "./conf.ozone.json",
        [
          200,
          responseHeaders.json,
          '{"ozoneApi": {"server": "https://alpha.flowr.cloud/","endpoint": "ozone/"}}'
        ]
      );
      // -- start test
      OzoneConfig.get().then(function(config){
        expect(config).to.deep.equal({server: "https://alpha.flowr.cloud/",endpoint: "ozone/"});
      })
        .then(() => done())
        .catch((e) => {
          done(e)
        });
      server.respond(); //Flush server
    });

    it('should catch error in configPromise', (done) => {

      // -- Configure mock server
      server.respondWith(
        'GET',
        "./conf.ozone.json",
        [
          400,
          responseHeaders.json,
          ''
        ]
      );
      // -- start test
      OzoneConfig.configPromise = null;
          OzoneConfig.get().catch((event) => {
        assert.isDefined(event);
        done()
      });
      server.respond(); //Flush server
    });
  });
