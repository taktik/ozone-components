/// <amd-module name="ozone-api-upload"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("ozone-api-upload", ["require", "exports", "decorators"], function (require, exports, taktik_polymer_typeScript_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * UploadFileRequest is a JavaScrip class that can be use as an
     * XMLHttpRequest to upload file on ozone.
     * If mask the complex series of AJAX call to one XMLHttpRequest like request.
     * Note: that UploadFileRequest implement only a subset of XMLHttpRequest
     *
     * example:
     * ```javaScript
     *  const uploader = new UploadFileRequest();
     *  uploader.open();
     *  const formData = new FormData();
     *  formData.append(file.formDataName, file, file.name);
     *  uploader.send(formData);
     * ```
     *
     * ### Events
     * * *ozone-upload-completed*: *CustomEvent*
     *    Fired when upload is complete with detail: {mediaId: uuid}
    *
    */
    let UploadFileRequest = class UploadFileRequest {
        constructor() {
            /**
             * set the interval to verify ozone has finish the element processing
             * @type {number} poll interval in ms
             */
            this.pollInterval = 500;
            /**
             * XMLHttpRequest.readyState
             * @type {number}
             */
            this.readyState = 0;
            this.isAbort = false;
            this.configPromise = getOzoneConfig().configPromise;
            this.configPromise.then((config) => {
                this.config = config;
            });
            this.upload = {
                onprogress: () => { },
                onloadstart: () => { },
            };
        }
        callOneadystatechange() {
            if (typeof (this.onreadystatechange) == 'function') {
                this.onreadystatechange();
            }
        }
        /**
         * like an XMLHttpRequest.open()
         * Parameters passed are not used.
         * method and URL come from the config file.
         * Request will always be async.
         *
         * @param {string} method
         * @param {string} url
         * @param {boolean} async
         */
        open(method, url, async = true) {
            this.readyState = 1;
        }
        /**
         * like an XMLHttpRequest.send()
         * start async process to upload the file inside the form.
         * @param {FormData} formData
         * @return {Promise<void>}
         */
        send(formData) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (this.uploadFile(formData));
            });
        }
        /**
         * like XMLHttpRequest.abort()
         * cancel current upload process
         */
        abort() {
            this.isAbort = true;
            if (this.currentRequest) {
                this.currentRequest.abort();
            }
        }
        /**
         * unused.
         * @param {string} key
         * @param {string} value
         */
        setRequestHeader(key, value) {
        }
        _createRequest() {
            if (this.isAbort) {
                throw new Error('request abort');
            }
            this.currentRequest = new XMLHttpRequest();
            this.currentRequest.withCredentials = true;
            this.currentRequest.responseType = 'json';
            return this.currentRequest;
        }
        _buildUrl(service, ...param) {
            const otherUrlParam = param || [];
            return [this.config.host, this.config.endPoints[service], ...otherUrlParam]
                .join('/')
                .replace(/\/\//g, '/');
        }
        /**
         * alias to send method.
         * @param {FormData} file
         * @param {string} folderId
         * @return {Promise<string | void>}
         */
        uploadFile(file, folderId = '0') {
            return this.configPromise
                .then(() => {
                return this._startUploadSession(file, folderId);
            })
                .then((result) => this._getUploadId(result))
                .then((result) => this._performUpload(result))
                .then((result) => this._endUploadSession(result))
                .then((result) => this._waitForTask(result))
                .then((mediaId) => {
                console.log("upload session complete", mediaId);
                this.status = 200;
                this.readyState = 4;
                this.callOneadystatechange();
                document.dispatchEvent(new CustomEvent('ozone-upload-completed', { bubbles: true, detail: { mediaId } }));
                return mediaId;
            }).catch((error) => {
                this.status = 555;
                this.readyState = 4;
                this.callOneadystatechange();
                console.error(error.message);
            });
        }
        notifyOnError(xhr) {
            return () => {
                if (xhr.status === 0
                    || xhr.status >= 500
                    || xhr.status >= 400) {
                    this.status = xhr.status;
                    this.readyState = 4;
                    this.callOneadystatechange();
                }
            };
        }
        _startUploadSession(file, folderId) {
            const xhr = this._createRequest();
            const url = this._buildUrl('uploadStart');
            xhr.open('POST', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = this.notifyOnError(xhr);
            //TODO understand need of folderId??
            const numeric_id = parseInt('0x' + folderId.split('-')[4]);
            const body = {
                mediaUploadChannelIdentifier: 'uploadChannel1',
                autoCommit: false,
                mediaMetadatas: [{
                        "type": {
                            "type": "PROPERTY",
                            "identifier": "org.taktik.metadata.folderId"
                        },
                        "valueObject": numeric_id.toString()
                    }]
            };
            const result = new Promise((resolve, reject) => {
                xhr.addEventListener("load", resolve);
                xhr.addEventListener("error", reject);
            });
            xhr.send(JSON.stringify(body));
            return result
                .then(() => {
                const response = xhr.response;
                return {
                    file: file,
                    sessionId: response.result
                };
            });
        }
        _getUploadId(data) {
            const xhr = this._createRequest();
            const url = this._buildUrl('uploadId', data.sessionId);
            xhr.open('GET', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = this.notifyOnError(xhr);
            const result = new Promise((resolve, reject) => {
                xhr.addEventListener("load", resolve);
                xhr.addEventListener("error", reject);
            })
                .then(() => {
                const response = xhr.response;
                const resultInfo = data;
                resultInfo.uploadId = response.result;
                resultInfo.folderId = response.folderId;
                return resultInfo;
            });
            xhr.send(null);
            return result;
        }
        _performUpload(data) {
            const xhr = this._createRequest();
            const url = this._buildUrl('upload', data.uploadId);
            xhr.open('POST', url, true);
            xhr.onreadystatechange = this.notifyOnError(xhr);
            xhr.upload.onprogress = this.upload.onprogress;
            const result = new Promise((resolve, reject) => {
                xhr.addEventListener("load", resolve);
                xhr.addEventListener("error", reject);
            });
            xhr.send(data.file);
            return result.then(() => {
                return data;
            });
        }
        _endUploadSession(data) {
            const xhr = this._createRequest();
            const url = this._buildUrl('uploadComplete', data.sessionId);
            xhr.open('POST', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = this.notifyOnError(xhr);
            const result = new Promise((resolve, reject) => {
                xhr.addEventListener("load", resolve);
                xhr.addEventListener("error", reject);
            })
                .then(() => {
                const response = data;
                response.uploadFileId = xhr.response.file;
                return response;
            });
            const info = {
                'selectedFileFieldNames': [['files']],
                mediaMetadatas: [
                    { type: { type: 'PROPERTY', identifier: 'org.taktik.metadata.folderId' }, valueObject: data.folderId }
                ]
            };
            xhr.send(JSON.stringify(info));
            return result;
        }
        _waitForTask(uploadEndResult) {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    this._awaitTask(uploadEndResult.uploadFileId)
                        .then((data) => {
                        if (data.taskExecutions[uploadEndResult.uploadFileId].isComplete) {
                            clearInterval(interval);
                            const mediaId = data
                                .taskExecutions[uploadEndResult.uploadFileId].taskResult.mediaId;
                            resolve(mediaId);
                        }
                    })
                        .catch((error) => {
                        clearInterval(interval);
                        reject(error);
                    });
                }, this.pollInterval);
            });
        }
        _awaitTask(uploadFileId) {
            const xhr = this._createRequest();
            const url = this._buildUrl('wait', uploadFileId, '120');
            xhr.open('GET', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = this.notifyOnError(xhr);
            const result = new Promise((resolve, reject) => {
                xhr.addEventListener("load", resolve);
                xhr.addEventListener("error", reject);
            })
                .then(() => {
                return xhr.response;
            });
            xhr.send(null);
            return result;
        }
    };
    UploadFileRequest = __decorate([
        taktik_polymer_typeScript_1.jsElement(),
        __metadata("design:paramtypes", [])
    ], UploadFileRequest);
    exports.UploadFileRequest = UploadFileRequest;
});
