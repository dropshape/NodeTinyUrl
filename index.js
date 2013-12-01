'use strict';

var NodeDI = require('node-di').NodeDI;
var BootStrap = require('./lib/BootStrap');
var Dependencies = require('./lib/dependencies/Module');
var Database = require('./lib/database/Module');
var ServerModule = require('./lib/server/Module');
var Features = require('./lib/feature/Module');

var DI = new NodeDI();
module.exports.Server = function Server() {
    var ready = new BootStrap(DI).start([Dependencies, Database, ServerModule, Features]);

    ready.then(function () {
        var logger = DI.module('dependenciesModule').service('logger').log(__filename);
        var webServer = DI.module('serverModule').value('webServer');
        logger.debug('Ready to start server');
        webServer.start();
    }, function (err) {
        var logger = DI.module('dependenciesModule').service('logger').log(__filename);
        logger.error('Error loading Server!', err);
    });
};
//Start the server
module.exports.Server();
