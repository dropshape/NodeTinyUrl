'use strict';

var _ = require('lodash');

function Logger(bunyan, config) {
    var loggerConfig = config.get('logger');
    this.log = function (prefix) {
        if (prefix.lastIndexOf('/') > -1) {
            prefix = prefix.slice(prefix.lastIndexOf('/') + 1);
        }
        var consoleLogger = loggerValues(
            loggerConfig.console,
            {
                stream: process.stdout
            }
        );
        return bunyan.createLogger(
            {
                name: prefix,
                streams: [
                    consoleLogger,
                    loggerConfig.file
                ]
            }
        );
    };
}

function loggerValues(config, defaults) {
    return _.defaults(config, defaults);
}

Logger.$inject = ['bunyan', 'config'];
exports = module.exports = Logger;