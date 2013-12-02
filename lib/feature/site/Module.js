'use strict';

function Module(container){
    return container.module('siteModule', ['serverModule'])
        .value('route', require('./Route'));
}

exports = module.exports = Module;
