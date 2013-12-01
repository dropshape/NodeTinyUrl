'use strict';

var logger = require('nodelogger').Logger(__filename);

function Module(container){

    logger.info('Initializing Module');

    return container.module('urlShortenerModule', ['serverModule'])
        .value('route', require('./Route'))
        .value('mongooseUrlShortener', require('mongoose-url-shortener').MongooseURLShortener)
        .value('urlShortener', require('./Shortener'));
}

exports = module.exports = Module;
