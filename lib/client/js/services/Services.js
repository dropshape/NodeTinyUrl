define(function (require) {
    'use strict';

    var angular = require('angular');

    return angular.module('tinyUrlServices', [])
        .service('tinyUrlService', require('./TinyUrl'))
        .service('topHitsService', require('./TopHits'))
        .service('d3Service', function(){
            return require('d3');
        });
});


