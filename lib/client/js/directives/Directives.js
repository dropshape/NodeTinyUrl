define(function (require) {
    'use strict';

    var angular = require('angular');
    require('angular-sanitize');

    return angular.module('tinyUrlDirectives', ['ngSanitize'])
        .directive('gitFork', require('./github/Directive'))
        .directive('tinyUrlTitle', require('./title/Directive'))
        .directive('tinyUrlShortUrl', require('./shorturl/Directive'))
        .directive('d3BarChart', require('./d3/BarChart'));
});


