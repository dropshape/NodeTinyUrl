/*jshint -W109*/
define(function (require) {
    'use strict';

    var angular = require('angular');

    angular.module("configModule", [])
    .constant("shareEndpoint", "/twitter/share").constant("via", "dropshape").constant("shareText", "Check out this post ");

});