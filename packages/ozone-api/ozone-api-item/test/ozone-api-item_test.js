import { OzoneApiItem, SearchGenerator } from '../src/ozone-api-item.ts'
import { OzoneConfig } from 'ozone-config'
import {SearchQuery } from "ozone-search-helper";
describe('ozone-api-login tests', function () {
    describe('CRUD operation', function () {

        let element,
            server,
            responseHeaders = {json: {'Content-Type': 'application/json'}};

        beforeEach((done) => {

            OzoneConfig.get().then(()=>{
                element = new OzoneApiItem();
                server = sinon.fakeServer.create();
                flush(done);
            });
          });

        afterEach(() => {
            server.restore();
        });
        it('should create an item', (done) => {
            // -- Configure mock server
            const expectedResponse = {an: 'object', with: "attributes"};
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.create({some: 'data', with: "attributes"})
                .then((response) => {
                    expect(response).to.be.deep.equal(expectedResponse);
                    done();
                })
                .catch((err)=>{
                    done(err);
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should getOne an existing item', (done) => {
            // -- Configure mock server
            const expectedResponse = {an: 'object', with: "attributes"};
            server.respondWith(
                'GET',
                "/ozone/rest/v3/items/item/an_id",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.getOne('an_id')
                .then((response) => {
                    expect(response).to.be.deep.equal(expectedResponse);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });
        it('getOne should return null when not found', (done) => {
            // -- Configure mock server
            server.respondWith(
                'GET',
                "/ozone/rest/v3/items/item/an_id",
                [
                    200,
                    responseHeaders.json,
                    ''
                ]
            );

            // -- start test
            element.getOne('an_id')
                .then((response) => {
                    assert.isNull(response)
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should update an item', (done) => {
            // -- Configure mock server
            const expectedResponse = {an: 'object', with: "attributes"};
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.update({some: 'data', with: "attributes"})
                .then((response) => {
                    expect(response).to.be.deep.equal(expectedResponse);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should deleteOne an item', (done) => {
            // -- Configure mock server
            const expectedResponse = 'item_Deleted';
            server.respondWith(
                'DELETE',
                "/ozone/rest/v3/items/item/an_id",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.deleteOne('an_id')
                .then((response) => {
                    expect(response).to.be.equal(expectedResponse);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should bulkDelete items', (done) => {
            // -- Configure mock server
            const expectedResponse = ['item_Deleted'];
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/bulkDelete",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.bulkDelete('an_id')
                .then((response) => {
                    expect(response).to.be.deep.equal(expectedResponse);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should bulkGet items', (done) => {
            // -- Configure mock server
            const expectedResponse = [
                {an: 'object', with: "attributes"},
                {an: 'other_object', with: "attributes"}
            ];
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/bulkGet",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.bulkGet(['an_id'])
                .then((response) => {
                    let result = response;

                    expect(result.length).to.equal(expectedResponse.length);
                    expect(result).to.include(expectedResponse[0]);
                    expect(result).to.include(expectedResponse[1]);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should bulkSave items', (done) => {
            // -- Configure mock server
            const expectedResponse = [
                {an: 'object', with: "attributes"},
                {an: 'other_object', with: "attributes"}
            ];
            server.respondWith(
                'POST',
                "/ozone/rest/v3/items/item/bulkSave",
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(expectedResponse)
                ]
            );

            // -- start test
            element.bulkSave([{some: 'data', with: "attributes"}])
                .then((response) => {
                    let result = response;

                    expect(result.length).to.equal(expectedResponse.length);
                    expect(result).to.include(expectedResponse[0]);
                    expect(result).to.include(expectedResponse[1]);
                    done();
                });
            setTimeout(()=> server.respond()); //Flush server
        });

        it('should change url on collection update', (done) => {
            element.on('new_Collection');
            expect(element.collection).to.be.equal('new_Collection');
            done();
        });
    });

    describe('search operation', function(){
        let afterFunctions = [],
            element,
            server,
            responseHeaders = {json: {'Content-Type': 'application/json'}};


        beforeEach((done) => {
            element = new OzoneApiItem();
            server = sinon.fakeServer.create();

            flush(done); //make sure every components are ready
        });
        afterEach(() => {
            server.restore();
            afterFunctions.map((cleanup) => {
                cleanup()
            });
            afterFunctions = [];

        });

        it('should send quicksearch query in all items on requestSearch call', (done) => {

            // -- Prepare expect function
            let expectToBeCall = (request) => {
                expect(request.method.toLowerCase()).to.be.equal('post');
                expect(request.url).to.be.equal('/ozone/rest/v3/items/item/search');
                let requestBody = JSON.parse(request.requestBody);
                expect(requestBody).to.include.keys('query');
                expect(requestBody).to.include.keys('size');
                expect(requestBody.query).to.deep.equal({
                    "$type": "QueryStringQuery",
                    "field": "_quicksearch",
                    "queryString": "*"
                });
                done();
            };
            // -- Configure mock server
            server.respondWith(expectToBeCall);

            // -- start test
            let searchQuery = new SearchQuery();
            searchQuery.quicksearch('');
            element.search(searchQuery).
            then(searchGenerator => searchGenerator.next() );
            setTimeout(()=> server.respond()); //Flush server
        });

        it('search should return searchResults with pagination', (done) => {
            // -- Configure mock server
            let queryResult = {
                "total": 2,
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
            let searchQuery = new SearchQuery();
            searchQuery.quicksearch('');
            const searchResults = element.search(searchQuery);

            searchResults
                .then((searchGenerator) => {
                    return searchGenerator.next()
                        .then((res)=>{
                        expect(res.total).to.be.equal(2);
                        expect(res.results[0]).to.be.deep.equal(queryResult.results[0]);
                            const resurlt =  searchGenerator.next()
                        setTimeout(()=> server.respond()); //Flush server
                            return resurlt
                    })
                } )
                .then((res)=>{
                    expect(res.results[0]).to.be.deep.equal(queryResult.results[0]);
                    done();
                });

            setTimeout(()=> server.respond()); //Flush server
        });
    });

    describe('SearchGenerator', ()=>{

        it('SearchGenerator is exposed as a global class', function() {
            const mySearchQuery = new SearchQuery();
            const mySearchGenerator = new SearchGenerator('url', mySearchQuery);
            expect(mySearchGenerator).to.be.an.instanceof(SearchGenerator);
        });

    })

});
