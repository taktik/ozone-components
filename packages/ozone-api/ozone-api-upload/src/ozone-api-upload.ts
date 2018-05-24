import * as Config from 'ozone-config'
import {OzoneAPIRequest} from "ozone-api-request";

export interface UploadSessionResult {
    file: FormData;
    sessionId: string;
}

export interface UploadIdResult extends UploadSessionResult {
    uploadId: string;
    folderId: string;
}

export interface UploadEndResult  extends UploadIdResult {
    uploadFileId: string;
}
export interface TaskResult  {
    mediaId: string;
    asyncTasksGroupId?: string
}
export interface TaskExecutions  {
    completed? : boolean //API v3
    isComplete? : boolean //API v2
    stepsCout: number,
    stepsDone: number,
    taskResult?: TaskResult;
}
export interface WaitResponse {
    groupId: string,
    hasErrors: boolean,
    stepsCount: number,
    stepsDone: number,
    taskExecutions: {
        [key:string]: TaskExecutions
    }
}

export interface XMLHttpRequestLike {

    upload: {
        onprogress: { (event: Event): void }
        onloadstart: { (event: Event): void }
    };

    onreadystatechange: { (): void };

    readyState: number;

    status: number;

    open(method: string, url: string, async: boolean):void;

    send(formData: FormData): void;

    abort():void;

    setRequestHeader(key: string, value: string):void;
}

/**
 * UploadFileRequest is a JavaScrip class that can be use as an
 * XMLHttpRequest to upload media using ozone v2 upload chanel.
 * It mask the complex series of AJAX call to one XMLHttpRequest like request.
 * Note: that UploadFileRequest implement only a subset of XMLHttpRequest
 *
 * example:
 * ```javaScript
 *  import {UploadFileRequest} from 'ozone-api-upload'
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
export class UploadFileRequest implements XMLHttpRequestLike {

    /**
     * Minimalist XMLHttpRequest.upload interface.
     */
    upload: {
        onprogress: { (event: Event): void }
        onloadstart: { (event: Event): void }
    };

    /**
     * XMLHttpRequest.onreadystatechange event handler
     */
    onreadystatechange: { (): void } = ()=>{};
    private callOneadystatechange() {
        if (typeof (this.onreadystatechange) == 'function') {
            this.onreadystatechange();
        }
    }

    /**
     * set the interval to verify ozone has finish the element processing
     * @type {number} poll interval in ms
     */
    pollInterval:number = 500;

    /**
     * XMLHttpRequest.readyState
     * @type {number}
     */
    readyState: number = 0;

    /**
     * XMLHttpRequest.status
     * @type {number}
     */
    status: number= NaN;

    /**
     * Set target for dispatchEvent.
     * default value is document.
     * @type {Node}
     */
    eventTarget: Node = document;

    private _mediaId:string | null = null;

    /**
     * Accessor to uploaded media id.
     * default value is null
     *
     * @return {string | null}
     */
    get mediaId(): string | null{
        return this._mediaId;
    }

    private config: Config.ConfigType | null = null;
    private isAbort:boolean = false;
    private currentRequest: OzoneAPIRequest | null = null ;

    constructor() {
        this.upload = {
            onprogress: () => {},
            onloadstart: () => {},
        };
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
    open(method: string, url: string, async: boolean = true) {
        this.readyState = 1;
    }

    /**
     * like an XMLHttpRequest.send()
     * start async process to upload the file inside the form.
     * @param {FormData} formData
     * @return {Promise<void>}
     */
    async send(formData: FormData) {
        await (this.uploadFile(formData));
    }

    /**
     * like XMLHttpRequest.abort()
     * cancel current upload process
     */
    abort() {
        this.isAbort = true;
        if(this.currentRequest){
            this.currentRequest.abort();
        }
    }

    /**
     * unused.
     * @param {string} key
     * @param {string} value
     */
    setRequestHeader(key: string, value: string) {

    }

    protected _createRequest(): OzoneAPIRequest{
        if(this.isAbort){
            throw new Error('request abort');
        }
        this.currentRequest = new OzoneAPIRequest();
        return this.currentRequest;
    }

    private _buildUrl(service: string, ...param: Array<string>): string {
        const otherUrlParam = param || [];
        if (this.config ===null){
            throw new Error('config is undefined')
        }
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
    uploadFile(file: FormData, folderId: string = '0'): Promise<string | null> {

        return Config.OzoneConfig.get()
            .then((config) => {
                this.config = config;
                return this._startUploadSession(file, folderId)
            })
            .then((result) => this._getUploadId(result))
            .then((result) => this._performUpload(result))
            .then((result) => this._endUploadSession(result))
            .then((result) => this._waitForTask(result))
            .then((mediaId: string) => {
                this.status = 200;
                this.readyState = 4;
                this.callOneadystatechange();

                this._mediaId = mediaId;

                this.eventTarget.dispatchEvent(
                    new CustomEvent('ozone-upload-completed',
                        {bubbles: true, detail: {mediaId}})
                );
                return mediaId;
            }).catch((error: Error)=>{
                this.status = 555;
                this.readyState = 4;
                this.callOneadystatechange();
                console.error(error.message)
                return null
        });
    }

    private notifyOnError(): ((this: XMLHttpRequest, ev: Event) => any){
        const self = this;
        return function (this: XMLHttpRequest, ev: Event) {
            if (this.status === 0
                || this.status >= 500
                || this.status >= 400) {
                self.status = this.status;
                self.readyState = 4;
                self.callOneadystatechange();
            }
        };
    }

    _startUploadSession(file: FormData, folderId: string): Promise<UploadSessionResult> {
        const request = this. _createRequest();
        request.url = this._buildUrl('uploadStart');
        request.method ='POST';

        request.onreadystatechange = this.notifyOnError();

        //TODO understand need of folderId??
        const numeric_id = parseInt('0x' + folderId.split('-')[4]);
        if (this.config ===null){
            throw new Error('config is undefined')
        }
        const body = {
            mediaUploadChannelIdentifier: this.config.uploadChannel,
            autoCommit: false,
            mediaMetadatas: [{
                "type": {
                    "type": "PROPERTY",
                    "identifier": "org.taktik.metadata.folderId"
                },
                "valueObject": numeric_id.toString()
            }]
        };
        request.body = JSON.stringify(body);
        return request.sendRequest()
            .then((xhr: XMLHttpRequest) => {
                const response = xhr.response;
                return {
                    file: file,
                    sessionId: response.result as string
                }
            });
    }

    _getUploadId(data: UploadSessionResult): Promise<UploadIdResult> {
        const request = this. _createRequest();
        request.url = this._buildUrl('uploadId', data.sessionId);
        request.method = 'GET';

        request.onreadystatechange = this.notifyOnError();

        return request.sendRequest()
            .then((xhr: XMLHttpRequest) => {
                const response = xhr.response;
                const resultInfo:UploadIdResult = data  as UploadIdResult;
                resultInfo.uploadId = response.result;
                resultInfo.folderId = response.folderId;
                return resultInfo;
            });
    }

    _performUpload(data: UploadIdResult): Promise<UploadIdResult> {
        const request = this. _createRequest();
        request.url = this._buildUrl('upload', data.uploadId);
        request.method = 'POST';

        request.onreadystatechange = this.notifyOnError();
        const xhr = request.createXMLHttpRequest(false)
        xhr.upload.onprogress = this.upload.onprogress;

        request.body = data.file;
        return request.sendRequest(xhr)
            .then(() => {
            return data;
        });
    }

    _endUploadSession(data: UploadIdResult): Promise<UploadEndResult> {
        const request = this. _createRequest();
        request.url = this._buildUrl('uploadComplete', data.sessionId);
        request.method = 'POST';


        request.onreadystatechange = this.notifyOnError();
        const info = {
            'selectedFileFieldNames': [['files']],
            mediaMetadatas: [
                { type: { type: 'PROPERTY', identifier: 'org.taktik.metadata.folderId' }, valueObject: data.folderId }
            ]
        };
        request.body = JSON.stringify(info);

        return request.sendRequest()
            .then((xhr: XMLHttpRequest) => {
                const response:UploadEndResult = data as UploadEndResult;
                response.uploadFileId = xhr.response.file;
                return response;
            });
    }
    _waitForSubTasks(asyncTasksGroupId: string): Promise<void> {
        let mediaId: string;
        return (new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                this._awaitTask(asyncTasksGroupId)
                    .then((data: WaitResponse) => {
                        if(data.stepsCount === data.stepsDone) {
                            clearInterval(interval);
                            resolve();
                        }
                        else if(data.hasErrors)
                            reject('possessing tasks as an error')
                    })
                    .catch((error) => {
                        clearInterval(interval);
                        reject(error);
                    })
            }, this.pollInterval);
        }))
    }
    _waitForTask(uploadEndResult: UploadEndResult): Promise<string> {
        let mediaId: string;
        return (new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                this._awaitTask(uploadEndResult.uploadFileId)
                    .then((data: WaitResponse) => {
                        const taskExecution = data.taskExecutions[uploadEndResult.uploadFileId];

                        if (taskExecution.isComplete ||
                            taskExecution.completed) {
                            clearInterval(interval);
                            if(taskExecution.taskResult)
                                mediaId = taskExecution.taskResult.mediaId;
                            resolve(taskExecution.taskResult);
                        }
                    })
                    .catch((error) => {
                        clearInterval(interval);
                        reject(error);
                    })
            }, this.pollInterval);
        }))
            .then((data: any): any => {
                const taskResult = data || {} as TaskResult
                if(taskResult.asyncTasksGroupId){
                    return this._waitForSubTasks(taskResult.asyncTasksGroupId)
                }
            })
            .then(()=> mediaId as string );
    }

    _awaitTask(uploadFileId: string): Promise<WaitResponse> {
        const request = this. _createRequest();
        request.url = this._buildUrl('wait', uploadFileId, '120');
        request.method = 'GET';

        request.onreadystatechange = this.notifyOnError();

        return request.sendRequest()
            .then((xhr: XMLHttpRequest) => {
                return xhr.response;
            });
    }
}