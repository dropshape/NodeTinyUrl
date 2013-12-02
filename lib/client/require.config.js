'use strict';

/*jshint -W079*/
/*jshint -W098*/
var require = {
    baseUrl: '/',
    paths: {
        angular: 'components/angular/angular',
        'angular-sanitize': 'components/angular-sanitize/angular-sanitize',
        lodash: 'components/lodash/lodash',
        text: 'components/text/text',
        d3:'components/d3/d3.min'
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