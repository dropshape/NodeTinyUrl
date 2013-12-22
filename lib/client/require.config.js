'use strict';

/*jshint -W079*/
/*jshint -W098*/
var require = {
    baseUrl: '/',
    paths: {
        angular: 'bower_components/angular/angular',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        lodash: 'bower_components/lodash/lodash',
        text: 'bower_components/text/text',
        d3:'bower_components/d3/d3.min'
    },
    shim:{
        angular: {
            exports: 'angular'
        },
        'angular-sanitize': {
            deps: ['angular'],
            exports: 'angular-sanitize'
        },
        d3:{
            exports:'d3'
        }
    }
};