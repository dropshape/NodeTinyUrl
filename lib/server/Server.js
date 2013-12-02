'use strict';

var http = require('http');

function Server(logger, config, express, apiMessage, database) {
    logger = logger.log('WebServer');
    var webServer = express();
    webServer.configure(function () {
        logger.info('Configuring Server');
        webServer.set('port', config.get('port'));
        //use ejs syntax but register it as html so we can more easily swap it out.
        webServer.set('views', config.get('staticFolder'));
        webServer.engine('.html', require('ejs').__express);
        webServer.set('view engine', 'html');
        //Gzip responses
        webServer.use(express.compress());
        webServer.use(express.logger(config.get('logger').express.level));
        webServer.use(express.urlencoded());
        webServer.use(express.json());
        webServer.use(express.methodOverride());
        webServer.use(express.cookieParser(config.get('cookieSecret')));
        webServer.use(express.session({secret: config.get('sessionSecret')}));
        webServer.use(apiMessage.initialize(database.connection));
        webServer.use(express.static(config.get('staticFolder')));
        //Router last as we want resources to be served first!
        webServer.use(webServer.router);
        http.createServer(webServer);
    });
    webServer.start = function () {
        webServer.close = webServer.listen(config.get('port'),function () {
            logger.info('Started Webserver on port', config.get('port'));
        }).close;
    };

    return webServer;
}

Server.$inject = [
    'logger', 'config', 'express', 'apiMessage', 'database'
];

exports = module.exports = Server;