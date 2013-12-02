define(function (require) {
    'use strict';

    var angular = require('angular');

    return angular.module('tinyUrlServices', [])
        .service('tinyUrlService', require('./TinyUrl'));
});


