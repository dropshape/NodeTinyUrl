define(function (require) {
    'use strict';

    var angular = require('angular');

    return angular.module('tinyUrlDirectives', [])
        .directive('gitFork', require('./github/Directive'))
        .directive('tinyUrlTitle', require('./title/Directive'))
        .directive('tinyUrlShortUrl', require('./shorturl/Directive'));
});


