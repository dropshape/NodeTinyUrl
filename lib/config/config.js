'use strict';

var convict = require('convict');

function configuration() {
    return {
        name: {
            doc: 'Application Name',
            format: '*',
            'default': 'drpsh',
            env: 'NAME'
        },
        logger: {
            doc: 'Logging level for the application',
            format: '*',
            'default': {
                console: {
                    level: 'error'
                },
                file: {
                    level: 'error',
                    path: 'Error.log'
                },
                express: {
                    level: 'dev'
                }
            },
            env: 'LOGGER'
        },
        ip: {
            doc: 'The IP address to bind.',
            format: 'ipaddress',
            'default': '127.0.0.1',
            env: 'IP_ADDRESS'
        },
        protocol: {
            doc: 'Host Protocol',
            format: '*',
            'default': 'http'
        },
        host: {
            doc: 'Host used for the application',
            format: '*',
            'default': 'localhost'
        },
        port: {
            doc: 'The port to bind.',
            format: '*',
            'default': 3001,
            env: 'PORT'
        },
        urlShortener: {
            doc: 'Url Shortener settings',
            format: '*',
            'default': {
                seed: 1000
            }
        },
        database: {
            doc: 'Database Settings',
            format: '*',
            env: 'DB'
        },
        env: {
            doc: 'The applicaton environment.',
            format: ['production', 'development', 'test', 'automation'],
            'default': 'development',
            env: 'NODE_ENV'
        },
        cookieSecret: {
            doc: 'Cookie secret',
            format: '*',
            'default': 'really secure',
            env: 'COOKIE_SECRET'
        },
        sessionSecret: {
            doc: 'Session secret',
            format: '*',
            'default': 'really secure',
            env: 'SESSION_SECRET'
        },
        staticFolder: {
            doc: 'Location of static resources',
            format: '*',
            'default': 'public',
            env: 'STATIC_FOLDER'
        }
    };
}

var conf = convict(configuration());

function configureDynamicParams() {
    conf.load({
        host:conf.get('name')
    });
    conf.load({
        database: {
            host: conf.get('host'),
            db: conf.get('name'),
            migrations: '"lib/database/**/*.migration.js"'
        },
        urlShortener: {
            port: conf.get('port'),
            protocol: conf.get('protocol'),
            host:conf.get('name') + '.com'
        }
    });
}

function setupDevelopmentConfig() {
    if (conf.get('env') === 'development') {
        conf.load({
            host:'localhost'
        });
        conf.load({
            database: {
                host: conf.get('host'),
                db: conf.get('name') + '-development'
            },
            logger: {
                console: {
                    level: 'debug'
                },
                file: {
                    level: 'error'
                }
            }
        });
    }
}

function setupProductionConfig() {
    if (conf.get('env') === 'development') {
        conf.load({
            database: {
            },
            logger: {
                console: {
                    level: 'debug'
                },
                file: {
                    level: 'error'
                }
            }
        });
    }
}

configureDynamicParams();
setupDevelopmentConfig();
setupProductionConfig();

console.log('ENVIRONMENT IS ', conf.get('env'));

conf.validate();

module.exports = conf;
module.exports.config = convict;
module.exports.configuration = configuration;