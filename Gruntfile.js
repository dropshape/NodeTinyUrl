module.exports = function (grunt) {
    'use strict';

    //Get Database configuration.
    var database = require('./lib/config/config').get('database');

    //Database migrations
    grunt.registerTask('database', ['shell:databaseUp']);
    grunt.registerTask('database:down', ['shell:databaseDown']);
    grunt.registerTask('database:drop', ['shell:databaseDrop']);

    //Default task runs tests, jshint and watches for changes.
    grunt.registerTask('default',
        ['jasmine_node', 'jshint', 'watch']);

    //Just run tests
    grunt.registerTask('test', 'jasmine_node');

    //Alias for default
    grunt.registerTask('test:watch', 'default');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //Tests
        jasmine_node: {
            options: {
                forceExit: true,
                verbose: true
            },
            files: { src: 'test/**/*.spec.js'}
        },

        //Clean code.
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: { src: ['index.js','lib/**/*.js', 'test/**/*.js']}
        },

        //Files to watch and actions to take when they are changed.
        watch: {
            files: ['index.js','lib/**/*.js', 'test/**/*.spec.js'],
            tasks: ['jshint', 'jasmine_node']
        },
        shell: {
            start:{
                command:'node index'
            },

            databaseDrop:{
                command:'./node_modules/mongoosemigrate/bin/mongoose-migrate' +
                    ' -db ' + database.db +
                    ' -host ' + database.host +
                    ' -drop'
            },
            //Database migrations
            databaseUp: {
//                command:'node node_modules/mongo-migrate -runmm -c lib/database -cfg config.json -dbn migrations'
                command: './node_modules/mongoosemigrate/bin/mongoose-migrate' +
                    ' -db ' + database.db +
                    ' -host ' + database.host +
                    ' -migrations ' + database.migrations
            },

            databaseDown: {
//                command:'node node_modules/mongo-migrate -runmm -c lib/database -cfg config.json -dbn migrations down'
                command: './node_modules/mongoosemigrate/bin/mongoose-migrate' +
                    ' -db ' + database.db +
                    ' -host ' + database.host +
                    ' -migrations ' + database.migrations +
                    ' down'
            }
        }
    });

    // Load the plugins
    // Watch the file system for changes.
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Runs tests.
    grunt.loadNpmTasks('grunt-jasmine-node');
    // Clean code validator.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //Runs shell scripts
    grunt.loadNpmTasks('grunt-shell');
};
