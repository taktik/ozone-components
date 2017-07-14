export interface UploadSessionResult {
    file: FormData;
    sessionId: string;
}
export interface UploadIdResult extends UploadSessionResult {
    uploadId: string;
    folderId: string;
}
export interface UploadEndResult extends UploadIdResult {
    uploadFileId: string;
}
export interface XMLHttpRequestLike {
    upload: {
        onprogress: {
            (event: Event): void;
        };
        onloadstart: {
            (event: Event): void;
        };
    };
    onreadystatechange: {
        (): void;
    };
    readyState: number;
    status: number;
    open(method: string, url: string, async: boolean): void;
    send(formData: FormData): void;
    abort(): void;
    setRequestHeader(key: string, value: string): void;
}
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
export declare class UploadFileRequest implements XMLHttpRequestLike {
    /**
     * Minimalist XMLHttpRequest.upload interface.
     */
    upload: {
        onprogress: {
            (event: Event): void;
        };
        onloadstart: {
            (event: Event): void;
        };
    };
    /**
     * XMLHttpRequest.onreadystatechange event handler
     */
    onreadystatechange: {
        (): void;
    };
    private callOneadystatechange();
    /**
     * set the interval to verify ozone has finish the element processing
     * @type {number} poll interval in ms
     */
    pollInterval: number;
    /**
     * XMLHttpRequest.readyState
     * @type {number}
     */
    readyState: number;
    /**
     * XMLHttpRequest.status
     * @type {number}
     */
    status: number;
    protected configPromise: Promise<ConfigType>;
    protected config: ConfigType;
    private isAbort;
    private currentRequest;
    constructor();
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
    open(method: string, url: string, async?: boolean): void;
    /**
     * like an XMLHttpRequest.send()
     * start async process to upload the file inside the form.
     * @param {FormData} formData
     * @return {Promise<void>}
     */
    send(formData: FormData): Promise<void>;
    /**
     * like XMLHttpRequest.abort()
     * cancel current upload process
     */
    abort(): void;
    /**
     * unused.
     * @param {string} key
     * @param {string} value
     */
    setRequestHeader(key: string, value: string): void;
    protected _createRequest(): XMLHttpRequest;
    private _buildUrl(service, ...param);
    /**
     * alias to send method.
     * @param {FormData} file
     * @param {string} folderId
     * @return {Promise<string | void>}
     */
    uploadFile(file: FormData, folderId?: string): Promise<string | void>;
    private notifyOnError(xhr);
    _startUploadSession(file: FormData, folderId: string): Promise<UploadSessionResult>;
    _getUploadId(data: UploadSessionResult): Promise<UploadIdResult>;
    _performUpload(data: UploadIdResult): Promise<UploadIdResult>;
    _endUploadSession(data: UploadIdResult): Promise<UploadEndResult>;
    _waitForTask(uploadEndResult: UploadEndResult): Promise<string>;
    _awaitTask(uploadFileId: string): Promise<any>;
}
