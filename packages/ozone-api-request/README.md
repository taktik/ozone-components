[![Build Status](https://travis-ci.org/hubjac1/ozone-api-request.svg?branch=master)](https://travis-ci.org/hubjac1/ozone-api-requestt)

# \<ozone-api-request\>


OzoneAPIRequest is a light wrapper over XMLHttpRequest to manager AJAX request to Ozone.

### Events

* *ozone-api-request-success* Fired when connection to ozone succeeds.
Event detail contains the XMLHttpRequest.

* *ozone-api-request-error* Fired when connection to ozone fails.
Event detail contains the XMLHttpRequest.

* *ozone-api-request-timeout* Fired when connection timeout.
Event detail contains the XMLHttpRequest

* *ozone-api-request-unauthorized* Fired when server return 403 unauthorized.
Event detail contains the XMLHttpRequest.


### Usage

* Basic usage with promise
```typeScript
const OzoneAPIRequest = new OzoneAPIRequest();
OzoneAPIRequest.url = url;
OzoneAPIRequest.method = 'GET';
OzoneAPIRequest.sendRequest()
   .then((res:XMLHttpRequest) => {
       // Do something with XMLHttpRequest
       console.log(res.response)
   })
   .catch((failRequest)=>{
       // Do something with XMLHttpRequest to handel the error.
       console.error(failRequest.statusText)
   })
```

* Usage with Event handler
```typeScript
this.addEventListener('ozone-api-request-success', (event: Event) => {
       // Do something with XMLHttpRequest
       console.log(event.detail.response)
   })
this.addEventListener('ozone-api-request-error', (event: Event) => {
       // Do something with XMLHttpRequest to handel the error.
       console.error(event.detail.statusText)
   })
const OzoneAPIRequest = new OzoneAPIRequest();
OzoneAPIRequest.setEventTarget(this)
OzoneAPIRequest.url = url;
OzoneAPIRequest.method = 'GET';
OzoneAPIRequest.sendRequest();
```

* Modify request before send

```typeScript
const OzoneAPIRequest = new OzoneAPIRequest();
OzoneAPIRequest.url = url;
OzoneAPIRequest.method = 'GET';
const request = OzoneAPIRequest.createXMLHttpRequest();
// Modify default request
request.setRequestHeader('Cache-Control', 'only-if-cached');
 *
OzoneAPIRequest.sendRequest(request);
// Handel response
```



## install & configure this module in an other a typeScript project


- step 1: install dependency

> Install you dependency
> npm install --save ozone-api-request

- step 2: use node module resolution in tsconfig.json
```json
{
    "compilerOptions":{
        "moduleResolution": "node"
    }
}
```


- step 3: import where you need
```typescript
import {customElement} from 'ozone-api-request' // Import elements
```
