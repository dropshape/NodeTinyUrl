define(function (require) {
    'use strict';

    var angular = require('angular');
    require('./directives/Directives');
    require('./services/Services');

    angular.module('indexModule', ['tinyUrlServices','tinyUrlDirectives']);

    angular.bootstrap(document, ['indexModule']);
});


