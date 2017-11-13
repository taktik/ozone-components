import './ozone-api-authentication'
import {OzoneApiAuthentication, getOzoneApiAuthentication} from './ozone-api-authentication'
import * as sinon from 'sinon'

describe('ozone-api-authentication', function() {
    let server : sinon.SinonFakeServer ;

    beforeEach(()=>{
        server = sinon.fakeServer.create();
    });

    afterEach(()=>{
        server.restore();
    });

    describe('logout', function() {
        it('should return resolve promise on logout succeed', function (done) {
            server.respondWith("GET", "/ozone/rest/v3/authentication/logout",
                [200, {"Content-Type": "application/json"},
                    '"disconnected"']);

            const api = getOzoneApiAuthentication();

            api.logout().then((response) => {
                done()
            }).catch((err) => {
                done(err);
            });
            setTimeout(() => server.respond());
        });
    })
    describe('ozoneConnect (login)', function() {
        it('should return resolve promise on connection succeed', function (done) {
            server.respondWith("POST", "/ozone/rest/v3/authentication/login/user",
                [200, {"Content-Type": "application/json"},
                    '"Connected"']);

            const api = getOzoneApiAuthentication();

            api.ozoneConnect('toto', 'foo').then((response) => {
                //assert.equal(response, "Connected");
                done()
            }).catch((err) => {
                done(err);
            });
            setTimeout(() => server.respond());
        });
        it('should fire ozone-api-request-success on connection succeed', function (done) {
            server.respondWith("POST", "/ozone/rest/v3/authentication/login/user",
                [200, {"Content-Type": "application/json"},
                    '"Connected"']);

            const api = getOzoneApiAuthentication();

            api.ozoneConnect('toto', 'foo')

            document.addEventListener('ozone-api-request-success', ()=>{
                debugger
                done();
            });

            setTimeout(() => server.respond());
        });
        it('should reject promise on error 403', function (done) {
            server.respondWith("POST", "/ozone/rest/v3/authentication/login/user",
                [403, {"Content-Type": "application/json"},
                    '"unauthorized"']);

            const api = getOzoneApiAuthentication();

            api.ozoneConnect('toto', 'foo').then((response) => {

                done('ERROR, sould not resolve')
            }).catch((err) => {
                done();
            });
            setTimeout(() => server.respond());
        });
        it('should return reject promise on any error', function (done) {
            server.respondWith("POST", "/ozone/rest/v3/authentication/login/user",
                [500, {"Content-Type": "application/json"},
                    '"server Error"']);

            const api = getOzoneApiAuthentication();

            api.ozoneConnect('toto', 'foo').then((response) => {
                //assert.equal(response, "Connection error");
                done('ERROR, should not resolve')
            }).catch((err) => {
                done();
            });
            setTimeout(() => server.respond());
        });
        it('should fire ozone-api-request-error on connection faill', function (done) {
            server.respondWith("POST", "/ozone/rest/v3/authentication/login/user",
                [500, {"Content-Type": "application/json"},
                    '"server error"']);

            const api = getOzoneApiAuthentication();

            api.ozoneConnect('toto', 'foo')

            document.addEventListener('ozone-api-request-error', ()=>{
                debugger
                done();
            });

            setTimeout(() => server.respond());
        });
    });
});