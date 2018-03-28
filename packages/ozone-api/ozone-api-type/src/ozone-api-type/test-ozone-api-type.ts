import {OzoneApiType, getOzoneApiType} from './ozone-api-type'
import {OzoneConfig, ConfigType} from 'ozone-config'
import * as sinon from 'sinon'
import {expect, assert} from 'chai'

declare function flush(cb:{():void}):void
describe('ozone-api-type tests', function () {
    describe('default collection', function () {

        let element:OzoneApiType ,
            server:sinon.SinonFakeServer,
            responseHeaders = {json: {'Content-Type': 'application/json'}},
            fields = [{"name": {"strings": {"en": "a_field_name"}}}],
            type = {fields: fields};

        beforeEach((done) => {

            OzoneConfig.get().then(()=>{
                server = sinon.fakeServer.create();
                server.respondWith(
                    'GET',
                    'ozone/rest/v3/type/item',
                    [
                        200,
                        responseHeaders.json,
                        JSON.stringify(type)
                    ]);

                element = getOzoneApiType();
                flush(done); //make sure every components are ready
            });
        });

        afterEach(() => {
            server.restore();
        });

        describe('loadType', function () {

            it('should set typeDescriptor', (done) => {
                element.loadType().then(() => {
                    expect(element._typeDescriptor).to.be.an.instanceof(Promise)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
            it('should resolve with typeDescriptor', (done) => {
                element.loadType().then((typeDescriptor) => {
                    expect(typeDescriptor).to.deep.equal(type)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
        });

        describe('getFields', function () {

            it('should list fields', (done) => {

                element.loadType();
                element.getFields().then((getFields) => {
                    expect(getFields).to.deep.equal(fields)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
        });
    });
    describe('given collection', function () {

        let element:OzoneApiType ,
            server:sinon.SinonFakeServer,
            responseHeaders = {json: {'Content-Type': 'application/json'}},
            fields = [{"name": {"strings": {"en": "a_field_name"}}}],
            type = {fields: fields};

        beforeEach((done) => {

            server = sinon.fakeServer.create();
            server.respondWith(
                'GET',
                'ozone/rest/v3/type/an_Other',
                [
                    200,
                    responseHeaders.json,
                    JSON.stringify(type)
                ]);
            element = getOzoneApiType();
            flush(done); //make sure every components are ready
        });

        afterEach(() => {
            server.restore();
        });

        describe('loadType', function () {

            it('should set typeDescriptor', (done) => {
                element.loadType('an_Other').then(() => {
                    expect(element._typeDescriptor).to.be.an.instanceof(Promise)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
            it('should resolve with typeDescriptor', (done) => {

                element.loadType('an_Other').then((typeDescriptor) => {

                    expect(typeDescriptor).to.deep.equal(type)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
        });

        describe('getFields', function () {

            it('should list fields', (done) => {

                element.loadType('an_Other');
                element.getFields().then((getFields) => {
                    expect(getFields).to.deep.equal(fields)
                    done();
                });
                setTimeout(() => {
                    server.respond()
                }, 0);
            });
        });
        describe('setType', function () {

            it('should resolve loadType if no cached exist', (done) => {

                element.loadType = sinon.stub().returns(Promise.resolve());

                element.setType('an_Other').then((result) => {
                    expect(result).to.deep.equal(element.typeCached);
                    assert.isTrue(element.typeCached.has('an_Other'))
                    assert.isTrue((element.loadType as sinon.SinonStub).called, 'loadType should have been called');
                    done();
                });
            });
            it('should resolve with cached value if exist', (done) => {
                element.typeCached.set('an_Other', Promise.resolve({identifier: 'any'}));
                element.loadType = sinon.stub().returns(Promise.resolve());

                element.setType('an_Other').then((result) => {
                    expect(result).to.deep.equal(element.typeCached);
                    assert.isTrue(element.typeCached.has('an_Other'))
                    assert.isFalse((element.loadType as sinon.SinonStub).called, 'loadType should not has been called')
                    done();
                });
            });
            describe('getType', function () {

                it('should resolve with cached value if exist', (done) => {

                    element.typeCached.set('an_Other', Promise.resolve({identifier: 'any'}));
                    element.setType = sinon.stub().returns(Promise.resolve(element.typeCached));
                    element.loadType = sinon.stub().returns(Promise.resolve());

                    element.getType('an_Other').then((result) => {
                        expect(result).to.deep.equal({identifier: 'any'});
                        assert.isFalse((element.loadType as sinon.SinonStub).called, 'loadType should not has been called');
                        done();
                    });
                });
                it('should resolve with setType if no cached exist', (done) => {

                    const localCollection = new Map()
                    element.setType = sinon.stub()
                        .returns(Promise.resolve(localCollection.set('not_yet_there', {value: 'any_not_yet_there'})));

                    element.getType('not_yet_there').then((result) => {
                        expect(result).to.deep.equal({value: 'any_not_yet_there'});
                        assert.isTrue((element.setType as sinon.SinonStub).called, 'loadType should have been called');
                        done();
                    });
                });
            });
            describe('findFieldInCollection', function () {

                it('should resolve with FieldDescriptor if exist in the collection', (done) => {
                    const expectedFields = {fields: [{identifier: 'id', value: 'any'}], superType: 'super'};
                    element.getType = sinon.stub();
                    (element.getType as sinon.SinonStub).withArgs('an_Other').returns(Promise.resolve(expectedFields));

                    element.findFieldInCollection('an_Other', 'id').then((result) => {
                        expect(result).to.deep.equal(expectedFields.fields[0]);
                        done();
                    });
                });
                it('should resolve with findFieldInCollection in superType', (done) => {

                    const expectedField1 = {fields: [{identifier: 'id', value: 'any'}], superType: 'super'};
                    const expectedField2 = {fields: [{identifier: 'parentId', value: 'some'}]};
                    element.getType = sinon.stub();
                    (element.getType as sinon.SinonStub).withArgs('an_Other').returns(Promise.resolve(expectedField1));
                    (element.getType as sinon.SinonStub).withArgs('super').returns(Promise.resolve(expectedField2));

                    element.findFieldInCollection('an_Other', 'parentId').then((result) => {
                        expect(result).to.deep.equal(expectedField2.fields[0]);
                        done();
                    });
                });
                it('should resolve with null if not found', (done) => {

                    const expectedField1 = {fields: [{identifier: 'id', value: 'any'}], superType: 'super'};
                    const expectedField2 = {fields: [{identifier: 'parentId', value: 'some'}]};
                    element.getType = sinon.stub();
                    (element.getType as sinon.SinonStub).withArgs('an_Other').returns(Promise.resolve(expectedField1));
                    (element.getType as sinon.SinonStub).withArgs('super').returns(Promise.resolve(expectedField2));

                    element.findFieldInCollection('an_Other', 'not_exist').then((result) => {
                        assert.isNull(result);
                        done();
                    });
                });
            });

            describe('ifIsTypeInstanceOf', function () {

                it('should resolve with true if types are equal', (done) => {
                    element.ifIsTypeInstanceOf('a', 'a').then(() => {
                        done();
                    })
                });

                it('should resolve if instance type is equal to parent', (done) => {
                    const type1 = {fields: [{identifier: 'id', value: 'any'}], superType: 'super'};
                    const type2 = {fields: [{identifier: 'parentId', value: 'some'}]};
                    element.getType = sinon.stub();
                    (element.getType as sinon.SinonStub).withArgs('child').returns(Promise.resolve(type1));
                    (element.getType as sinon.SinonStub).withArgs('super').returns(Promise.resolve(type2));

                    element.ifIsTypeInstanceOf('child', 'super').then((result) => {
                        assert.isTrue(result);
                        done();
                    })
                });

                it('should resolve with false if is not an instance', (done) => {
                    const type1 = {fields: [{identifier: 'id', value: 'any'}], superType: 'super'};
                    const type2 = {fields: [{identifier: 'parentId', value: 'some'}]};
                    element.getType = sinon.stub();
                    (element.getType as sinon.SinonStub).withArgs('child').returns(Promise.resolve(type1));
                    (element.getType as sinon.SinonStub).withArgs('super').returns(Promise.resolve(type2));

                    element.ifIsTypeInstanceOf('child', 'other').then((result) => {
                        assert.isFalse(result);
                        done();
                    });
                });
            })
        });
    });
});
