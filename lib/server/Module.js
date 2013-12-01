'use strict';

function Module(container) {
    return container.module('serverModule', ['dependenciesModule', 'databaseModule'])
        .value('webServer', require('./Server'));
}

exports = module.exports = Module;