var ALL_BROWSERS =
    [
        {
            maxInstances: 1,
            version:62,
            browserName: 'chrome',
            os: 'OS X',
            os_version: 'Sierra',
            resolution: '1024x768',
        },
        {
            maxInstances: 1,
            version:56,
            browserName: 'firefox',
            os: 'OS X',
            os_version: 'Sierra',
            resolution: '1024x768',
        }
    ];


var ret = {
    'suites': ['test/index.html'],
    'webserver': {
        'pathMappings': []
    },
    "plugins": {
        "local": {
        },
        "headless": {
        },
    }
};


console.log('Run test locally');
ret.plugins.local.browsers = ALL_BROWSERS.map((browser) => browser.browserName);
ret.plugins.headless.browsers = [ALL_BROWSERS[1]];


module.exports = ret;