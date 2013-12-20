define(function (require) {
    'use strict';

    var angular = require('angular');
    require('./config');
    require('./directives/Directives');
    require('./services/Services');
    require('./controllers/Controllers');

    angular.module('indexModule', [
        'configModule',
        'tinyUrlServices',
        'tinyUrlDirectives',
        'tinyUrlControllers'
    ]);

    angular.bootstrap(document, ['indexModule']);
});


