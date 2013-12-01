'use strict';

function Shortener(UrlShortener, config, mongoose) {

    return new UrlShortener(mongoose, {
        seed: config.get('urlShortener').seed
    });
}

Shortener.$inject = ['mongooseUrlShortener', 'config', 'mongoose'];
exports = module.exports = Shortener;
