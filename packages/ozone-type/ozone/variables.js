define(["require", "exports", '@angular/core'], function (require, exports, core_1) {
    "use strict";
    exports.BASE_PATH = new core_1.OpaqueToken('basePath');
    exports.COLLECTION_FORMATS = {
        'csv': ',',
        'tsv': '   ',
        'ssv': ' ',
        'pipes': '|'
    };
});
