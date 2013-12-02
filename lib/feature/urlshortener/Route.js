'use strict';
var Status = require('node-api-message').Status;
var urlUtil = require('url');
var urlRegex = /([\da-z\.-]+)\.([a-z\.]{2,6})/;

function Route(logger, config, webServer, urlShortener) {
    logger = logger.log('UrlShortener');

    logger.info('Initializing url Shortener Module');

    var params = config.get('urlShortener');

    var protocol = params.protocol;
    var host = params.host;

    webServer.get('/:id?',
        getShortUrl
    );
    webServer.post('/',
        createShortUrl
    );
    webServer.get('/get/:id?',
        getShortUrlObj
    );

    //-------------------------------------------------------------------------
    //
    // Private Methods
    //
    //-------------------------------------------------------------------------

    /**
     * Convert a short url into a full blown url and redirect.
     * @param req
     * @param res
     */
    function getShortUrl(req, res) {
        var id = req.params.id;
        if (id) {
            urlShortener.resolve(id, {ip: req.ip, date: Date.now()}, function (err, shortUrl) {
                if (err || !shortUrl) {
                    return res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id);
                }
                logger.debug('Redirecting to', shortUrl.url);
                res.redirect(shortUrl.url);
            });
        } else {
            res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id);
        }
    }

    /**
     * Return the actual short url object instead of redirecting
     * @param req
     * @param res
     */
    function getShortUrlObj(req, res){
        var id = req.params.id;
        if (id) {
            urlShortener.resolve(id, {ip: req.ip, date: Date.now()}, function (err, shortUrl) {
                if (err || !shortUrl) {
                    return res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id);
                }
                res.apiMessage(Status.OK, 'short url', shortUrl);
            });
        } else {
            res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id);
        }
    }

    /**
     * Create a short url from a full url.
     */
    function createShortUrl(req, res) {
        var url = req.body.url;
        if (url) {
            var matches = url.match(urlRegex);
            if(matches){
                urlShortener.shorten(url, {userId: req.user}, function (err, shortUrl) {
                    if (err) {
                        logger.error(err);
                        return res.apiMessage(Status.BAD_REQUEST, 'error creating short url', url);
                    }
                    var url = {
                        protocol: protocol,
                        host: host,
                        pathname: shortUrl.hash
                    };
                    res.apiMessage(Status.OK, 'short url created', {redirect: urlUtil.format(url)});
                });
            }else{
                res.apiMessage(Status.BAD_REQUEST, 'Invalid URL', url);
            }

        } else {
            res.apiMessage(Status.BAD_REQUEST, 'error creating short url', url);
        }
    }
}

Route.$inject = ['logger', 'config','webServer','urlShortener'];

exports = module.exports = Route;