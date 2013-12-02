define(function (require) {
    'use strict';

    var angular = require('angular');
    require('./directives/Directives');
    require('./services/Services');
    require('./controllers/Controllers');

    angular.module('indexModule', ['tinyUrlServices','tinyUrlDirectives', 'tinyUrlControllers']);

    angular.bootstrap(document, ['indexModule']);
});


