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

    webServer.get('/toplinks/:count',
        getTopLinks
    );

    //-------------------------------------------------------------------------
    //
    // Private Methods
    //
    //-------------------------------------------------------------------------

    function getTopLinks(req, res) {
        var count = req.params.count || 10;
        if (count > 0) {
            urlShortener.Model.find({},{totalHits:1, url:1}, {limit: count, sort:{totalHits:-1}}, function (err, results) {
                res.apiMessage(Status.OK, 'top links', results);
            });
        } else {
            res.apiMessage(Status.BAD_REQUEST, 'you must specify a positive count!', count);
        }
    }

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
    function getShortUrlObj(req, res) {
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
            if (matches) {
                urlShortener.shorten(url, {userId: req.user}, function (err, shortUrl) {
                    if (err) {
                        logger.error(err);
                        return res.apiMessage(Status.BAD_REQUEST, 'error creating short url', url);
                    }
                    var formattedUrl = urlUtil.format({
                        protocol: protocol,
                        host: host,
                        pathname: shortUrl.hash
                    });
                    res.apiMessage(Status.OK, 'short url created', {url: formattedUrl});
                });
            } else {
                res.apiMessage(Status.BAD_REQUEST, 'Invalid URL', url);
            }

        } else {
            res.apiMessage(Status.BAD_REQUEST, 'error creating short url', url);
        }
    }
}

Route.$inject = ['logger', 'config', 'webServer', 'urlShortener'];

exports = module.exports = Route;