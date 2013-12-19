'use strict';
var Status = require('node-api-message').Status;
var urlUtil = require('url');
var urlRegex = /([\da-z\.-]+)\.([a-z\.]{2,6})/;
var Q = require('q');

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

    webServer.get('/twitter/share', shareLink);

    //-------------------------------------------------------------------------
    //
    // Private Methods
    //
    //-------------------------------------------------------------------------

    /**
     * Return the top short url links.
     * @param req
     * @param res
     */
    function getTopLinks(req, res) {
        var count = req.params.count || 10;
        if (count > 0) {
            urlShortener.Model.find({}, {totalHits: 1, url: 1}, {limit: count, sort: {totalHits: -1}}, function (err, results) {
                res.apiMessage(Status.OK, 'top links', results);
            });
        } else {
            res.apiMessage(Status.BAD_REQUEST, 'you must specify a positive count!', count);
        }
    }

    /**
     * Share a link on twitter
     * @param req
     * @param res
     */
    function shareLink(req, res) {
        var link = req.query.link;
        var text = req.query.text || 'Check out this post. ';
        if (link) {
            res.apiMessage(Status.OK, 'redirect to', {redirect: createTwitterRedirect(req, link, text)});
        } else {
            res.apiMessage(Status.BAD_REQUEST, 'you must provide a link');
        }
    }

    /**
     * Creates the twitter Share link
     * @param req
     * @param link
     * @param text
     * @returns {*}
     */
    /*jshint -W106*///camel_case
    function createTwitterRedirect(req, link, text) {
        var url = {
            protocol: 'https',
            host: 'twitter.com',
            pathname: 'intent/tweet',
            query: {
                original_referer: req.headers.origin,
                text: text + link,
                via: 'dropshape'
            }
        };
        return urlUtil.format(url);
    }

    /**
     * Convert a short url into a full blown url and redirect.
     * @param req
     * @param res
     */
    function getShortUrl(req, res) {
        resolveShortUrl(req, res).then(function (shortUrl) {
            logger.debug('Redirecting to', shortUrl.url);
            res.redirect(shortUrl.url);
        });
    }

    /**
     * Return the actual short url object instead of redirecting
     * @param req
     * @param res
     */
    function getShortUrlObj(req, res) {
        resolveShortUrl(req, res).then(function (shortUrl) {
            return res.apiMessage(Status.OK, 'short url', shortUrl);
        });
    }

    /**
     * Create a short url from a full url.
     */
    function createShortUrl(req, res) {
        var url = req.body.url;
        if (url && url.match(urlRegex)) {
            urlShortener.shorten(url, {userId: req.user})
                .then(function (shortUrl) {
                    var formattedUrl = urlUtil.format({
                        protocol: protocol,
                        host: host,
                        pathname: shortUrl.hash
                    });
                    return res.apiMessage(Status.OK, 'short url created', {url: formattedUrl});
                }).fail(function (err) {
                    logger.error('Error creating short url', err);
                    return res.apiMessage(Status.BAD_REQUEST, 'error creating short url', url);
                });
        } else {
            logger.error('Invalid URL', url);
            return res.apiMessage(Status.BAD_REQUEST, 'Invalid URL', url);
        }
    }

    function resolveShortUrl(req, res) {
        var id = req.params.id;
        if (id) {
            return urlShortener.resolve(id, {ip: req.ip, date: Date.now()})
                .then(function (shortUrl) {
                    if (!shortUrl) {
                        throw new Error('Error finding short url');
                    }
                    return shortUrl;
                })
                .fail(function (err) {
                    logger.error('Error finding short url ', err, id);
                    return res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id);
                });
        } else {
            logger.error('Error finding short url ', id);
            return Q.defer().reject(res.apiMessage(Status.BAD_REQUEST, 'error finding short url', id));
        }
    }
}

Route.$inject = ['logger', 'config', 'webServer', 'urlShortener'];

exports = module.exports = Route;