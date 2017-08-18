var ALL_BROWSERS =
    [
        {
            maxInstances: 1,
            browserName: 'chrome',
            os: 'OS X',
            os_version: 'Sierra',
            resolution: '1024x768',
        },
        {
            maxInstances: 1,
            version:54,
            browserName: 'firefox',
            os: 'OS X',
            os_version: 'Sierra',
            resolution: '1024x768',
        }
    ];


var ret = {
  'suites': ['test'],
  'webserver': {
    'pathMappings': []
  },
    "plugins": {
        "junit-reporter": {
            output: {
                path: "junitReport/",
                name: "test-report.xml"
            }
        }
    }
};
function configBrowserStack(config) {
    var user = process.env.BROWSERSTACK_USER;
    var key = process.env.BROWSERSTACK_KEY;
    if (!user || !key) {
        throw new Error('Missing BrowserStack credentials. Did you forget to set BROWSERSTACK_USER and/or BROWSERSTACK_KEY?');
    }

    var url = process.env.BROWSERSTACK_URL
        || 'http://' + user + ':' + key + '@hub.browserstack.com/wd/hub';


    var browsers = ALL_BROWSERS.map(function(b) {
        b['browserstack.local'] = 'true';
        b['browserstack.debug'] = 'true';
        b['url'] = url;
        return b;
    });

    config.activeBrowsers = config.activeBrowsers || [];
    config.activeBrowsers = config.activeBrowsers.concat(browsers);
}

if(process.env.BROWSERSTACK_USER) {
    console.log('Run test on BROWSERSTACK');
    configBrowserStack(ret);
} else {
    console.log('Run test locally');
    ret.plugins.local = {
        "browsers": ALL_BROWSERS.map((browser) => browser.browserName)
    };
}

module.exports = ret;
