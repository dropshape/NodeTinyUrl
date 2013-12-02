'use strict';

function featureModule(container){
    require('./site/Module')(container);
    require('./urlshortener/Module')(container);
}

exports = module.exports = featureModule;