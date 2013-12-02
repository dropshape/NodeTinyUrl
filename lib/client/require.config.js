'use strict';

/*jshint -W079*/
/*jshint -W098*/
var require = {
    baseUrl: '/',
    paths: {
        angular: 'components/angular/angular',
        lodash: 'components/lodash/lodash',
        text: 'components/text/text',
        d3:'components/d3/d3.min'
    },
    shim:{
        angular: {
            exports: 'angular'
        },
        d3:{
            exports:'d3'
        }
    }
};