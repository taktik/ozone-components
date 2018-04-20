import {OzoneApiSearch} from "./ozone-api-search"
import "./ozone-api-search_test.html"
import {OzoneConfig} from "ozone-config";


describe('ozone-api-search', function () {
    let afterFunctions= [],
        server,
        responseHeaders = {json: {'Content-Type': 'application/json'}};


    beforeEach((done) => {
        OzoneConfig.get().then((config) => {
            server = sinon.fakeServer.create();
            flush(done); //make sure every components are ready
        });
    });
    afterEach(() => {
        server.restore();
        afterFunctions.map((cleanup) => {
            cleanup()
        });
        afterFunctions = [];

    });
    describe('in all type', function () {
        let element;
        beforeEach((done) => {
            element = fixture('basic');
            flush(done); //make sure every components are ready
        });

        it('should send suggestion query in all items on requestSearch call', (done) => {

            // -- Prepare expect function
            let expectToBeCall = (request) => {
                expect(request.method.toLowerCase()).to.be.equal('post');
                expect(request.url).to.be.equal('/ozone/rest/v3/items/item/search');
                let requestBody = JSON.parse(request.requestBody);
                expect(requestBody).to.include.keys('query');
                expect(requestBody).to.include.keys('size');
                done();
            };
            // -- Configure mock server
            server.respondWith(expectToBeCall);

            // -- start test
           // element.requestSearch();
            server.respond(); //Flush server
        });

        it('should expose search result in searchResults', (done) => {
            // -- Configure mock server
            let queryResult = {
                "total": 1,
                "size": 1,
                "results": [
                    {
                        "id": "00000000-046c-7fc4-0000-0000000034e4",
                        "version": "d3cbfe10-a1db-11e6-8e20-0948d7fd8c2b",
                        "type": "image",
                        "date": "2016-11-03T15:33:45.776Z",
                        "creationUser": "00000000-0028-5feb-0000-000000000001",
                        "previewRatio": 2,
                        "fileUTI": [
                            "public.item",
                            "public.png",
                            "public.data",
                            "public.image",
                            "public.content"
                        ],
                        "modificationUser": "00000000-0028-5feb-0000-0000000001f5",
                        "title": "animal_planet_lam",
                        "creationDate": "2016-11-03T15:33:45.776Z",
                        "stocks": [],
                        "derivedFiles": [
                            "00000000-0021-699c-0000-000000002e29",
                            "00000000-0021-699c-0000-000000002e28",
                            "00000000-0021-699c-0000-000000002e25",
                            "00000000-0021-699c-0000-000000002e24",
                            "00000000-0021-699c-0000-000000002e27",
                            "00000000-0021-699c-0000-000000002e26"
                        ],
                        "parentFolder": "00000000-046c-7fc4-0000-0000000000f3",
                        "modificationDate": "2016-11-03T15:33:46.701Z",
                        "file": "00000000-0021-699c-0000-000000001fcd",
                        "deleted": false,
                        "previewDate": "2016-11-03T15:40:20.371Z",
                        "collections": [],
                        "name": "animal_planet_lam.png",
                        "tenant": "b12f0242-ac14-000b-061e-bb30fe6811e6",
                        "status": "READY",
                        "_meta": {
                            "state": "OK",
                            "validity": "VALID",
                            "security": "ALLOWED"
                        }
                    }
                ]
            };
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/search",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(queryResult)
                ]
            );

            // -- start test
            //element.requestSearch();
            server.respond(); //Flush server
            flush(() => {
                expect(element.searchResults).to.be.instanceof(Array);
                expect(element.searchResults[0]).to.be.deep.equal(queryResult.results[0]);
                done();
            });

        });
    });

    describe('auto complete', function () {
        let element;
        beforeEach((done) => {
            element = fixture('suggest');
            flush(done); //make sure every components are ready
        });

        it('should propose suggestion', (done) => {
            // -- Configure mock server
            let queryResult = {
                "total": 79,
                "size": 0,
                "results": [],
                "aggregations": [
                    {
                        "name": "suggest",
                        "buckets": [
                            {
                                "key": "animal_planet_lam",
                                "docCount": 3
                            },
                            {
                                "key": "animal_planet_lam.png",
                                "docCount": 3
                            },
                            {
                                "key": "0000",
                                "docCount": 2
                            }
                        ],
                        "$type": "TermsAggregationResult"
                    }
                ]
            };
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/search",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(queryResult)
                ]
            );

            // -- start test
            element.requestSearch();
            server.respond(); //Flush server
            flush(() => {
                expect(element.searchResults).to.be.instanceof(Array);
                expect(element.searchResults).to.be.deep.equal(queryResult.aggregations[0].buckets);
                done();
            });
        });

    });

    describe('in one type (media)', function () {
        let element;
        beforeEach((done) => {
            element = fixture('media');
            flush(done); //make sure every components are ready
        });
        it('should send suggestion query in media on requestSearch call with media specify', (done) => {

            // -- Prepare expect function
            let expectToBeCall = (request) => {
                expect(request.method.toLowerCase()).to.be.equal('post');
                expect(request.url).to.be.equal('/ozone/rest/v3/items/media/search');
                done();
            };
            // -- Configure mock server
            server.respondWith(expectToBeCall);

            // -- start test
            //element.requestSearch();
            server.respond(); //Flush server
        });

    });

    describe('auto option', function () {
        let element;
        beforeEach((done) => {
            element = fixture('auto');
            flush(done); //make sure every components are ready
        });

        it('should request automatically at initialisation', (done) => {

            let queryResult = JSON.stringify({
                "total": 79,
                "size": 0,
                "results": [],
                "aggregations": [
                    {
                        "name": "suggest",
                        "buckets": [
                            {
                                "key": "animal_planet_lam",
                                "docCount": 3
                            },
                            {
                                "key": "animal_planet_lam.png",
                                "docCount": 3
                            },
                            {
                                "key": "0000",
                                "docCount": 2
                            }
                        ],
                        "$type": "TermsAggregationResult"
                    }
                ]
            });
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/search",
                [
                    200,
                    responseHeaders.json,
                    queryResult
                ]
            );
            let expectCallback = sinon.spy();
            afterFunctions.push(() => {
                if (element.removeEventListener) {
                    element.removeEventListener('ozone-api-request-success', expectCallback);
                }
            });
            element.addEventListener('ozone-api-request-success', expectCallback);

            // -- start test

            server.respond(); //Flush server
            flush(() => {
                assert.isTrue(expectCallback.calledOnce);
                done();
            });
        });

    });
});
