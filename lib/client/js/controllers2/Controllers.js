define(function (require) {
    'use strict';

    var angular = require('angular');

    return angular.module('tinyUrlControllers', [])
        .controller('mainController',  require('./MainController'));
});


