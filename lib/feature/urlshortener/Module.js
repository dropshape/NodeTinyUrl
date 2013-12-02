'use strict';

function Module(container){

    return container.module('urlShortenerModule', ['serverModule'])
        .value('route', require('./Route'))
        .value('mongooseUrlShortener', require('mongoose-url-shortener').MongooseURLShortener)
        .value('urlShortener', require('./Shortener'));
}

exports = module.exports = Module;
