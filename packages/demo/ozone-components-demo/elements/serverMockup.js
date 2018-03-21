const Url = require('url');

function setup(app){
    const proxy = require('proxy-middleware');
    const config = require('../config/conf.ozone');

    const ozoneConfig = config.ozoneApi;
    const ozoneServer = ozoneConfig.hostProxy;
    const proxyOptions = Url.parse(ozoneServer);
    proxyOptions.cookieRewrite = true;

    app.use(config.ozoneApi.host,
        proxy(proxyOptions)
    );

}

module.exports = setup;
