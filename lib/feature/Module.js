'use strict';

function featureModule(container){
    require('./urlshortener/Module')(container);
}

exports = module.exports = featureModule;