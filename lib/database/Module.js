'use strict';

function Module(container){

    return container.module('databaseModule', ['dependenciesModule'])
        .service('database', require('./Database'));
}

exports = module.exports = Module;