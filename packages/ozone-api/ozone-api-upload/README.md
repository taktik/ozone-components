[![Build Status](https://travis-ci.org/taktik/ozone-api-upload.svg?branch=master)](https://travis-ci.org/taktik/ozone-api-upload)
[![NPM version][npm-image]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url]


# \<ozone-api-upload\>

UploadFileRequest is a JavaScrip class that can be use as an XMLHttpRequest to upload media using ozone v2 upload chanel.
It mask the complex series of AJAX call to one XMLHttpRequest like request.
Note: that UploadFileRequest implement only a subset of XMLHttpRequest


## install

```
$ npm install --save ozone-api-upload
```

## usage

```javaScript
  import {UploadFileRequest} from 'ozone-api-upload'

  const uploader = new UploadFileRequest();
  uploader.open();
  const formData = new FormData();
  formData.append(file.formDataName, file, file.name);
  uploader.send(formData);
```

[npm-image]: https://badge.fury.io/js/ozone-api-upload.svg
[npm-url]: https://npmjs.org/package/ozone-api-upload
[daviddm-image]: https://david-dm.org/taktik/ozone-api-upload.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/taktik/ozone-api-upload