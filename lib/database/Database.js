'use strict';


function Database(logger, config, mongoose){
    var log = logger.log('Database');

    var databaseConfig = config.get('database');
    var host = databaseConfig.host;
    var db = databaseConfig.db;
    var connection = 'mongodb://' + host + '/' + db;
    log.info('Configuring Database', connection);

    mongoose.connect(
        connection, function (err) {
            if (err) {
                log.error('Database Error:', err);
            } else {
                log.debug('Created Database connection', connection);
            }
        });
    return mongoose;
}

Database.$inject = ['logger', 'config', 'mongoose'];

exports = module.exports = Database;