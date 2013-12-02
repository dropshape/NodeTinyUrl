'use strict';

function Route(logger, webServer) {
    logger = logger.log('Site');

    logger.info('Initializing Site Module');

    webServer.get('/',
        getIndex
    );
    webServer.get('/index.html',
        getIndex
    );

    //-------------------------------------------------------------------------
    //
    // Private Methods
    //
    //-------------------------------------------------------------------------

    function getIndex(req, res){
        logger.info('Render Index Page');
        res.render('index');
    }
}

Route.$inject = ['logger', 'webServer'];

exports = module.exports = Route;