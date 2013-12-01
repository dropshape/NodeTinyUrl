'use strict';

var http = require('http');

function Server(logger, config, express, apiMessage, database) {
    logger = logger.log('WebServer');
    var webServer = express();
    webServer.configure(function () {
        logger.info('Configuring Server');
        webServer.set('port', config.get('port'));
        //Gzip responses
        webServer.use(express.compress());
        webServer.use(express.logger(config.get('logger').express.level));
        webServer.use(express.bodyParser());
        webServer.use(express.methodOverride());
        webServer.use(express.cookieParser(config.get('cookieSecret')));
        webServer.use(express.session({secret: config.get('sessionSecret')}));
        webServer.use(apiMessage.initialize(database.connection));
        webServer.use(webServer.router);
        webServer.use(express.static(config.get('staticFolder')));
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