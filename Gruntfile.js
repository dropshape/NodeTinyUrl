module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    //Get configuration.
    var config = require('./lib/config/config');
    var database = config.get('database');
    var outputDir = config.get('staticFolder');

    //Default task runs tests, jshint and watches for changes.
    grunt.registerTask('default',
        ['jasmine_node', 'jshint', 'css', 'symlink', 'ngconstant:dev', 'watch']);

    grunt.registerTask('prod',
        [ 'database', 'css','ngconstant:dist', 'symlink']);

    //Database migrations
    grunt.registerTask('database', ['shell:databaseUp']);
    grunt.registerTask('database:down', ['shell:databaseDown']);
    grunt.registerTask('database:drop', ['shell:databaseDrop']);

    //CSS
    grunt.registerTask('css', ['compass:dev']);
    grunt.registerTask('css:dist', ['compass:dist']);

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
            files: { src: ['index.js', 'lib/**/*.js', 'test/**/*.js', '!lib/client/vendor/**/*.js']}
        },

        //Files to watch and actions to take when they are changed.
        watch: {
            files: ['index.js', 'lib/client/*.js', 'test/**/*.spec.js'],
            tasks: [ 'css', 'jshint', 'jasmine_node']
        },

        shell: {
            start: {
                command: 'npm start'
            },

            databaseDrop: {
                command: './node_modules/mongoosemigrate/bin/mongoose-migrate' +
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
        },

        //Compile stylesheets
        compass: {
            options: {
                cssDir: outputDir + '/styles',
                sassDir: 'lib/client/sass',
                imagesDir: 'lib/client/sprites',
                generatedImagesDir: outputDir + '/images/sprites',
                httpGeneratedImagesPath: '/images/sprites'
            },
            dev: {
                options: {
                    outputStyle: 'expanded'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                }
            }
        },

        //In Development mode simply symlink files to the output directory
        symlink: {
            expanded: {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components'
                        ],
                        dest: outputDir
                    }
                ]
            },
            explicit: {
                files: [
                    {
                        src: 'lib/**/index.html',
                        dest: outputDir + '/index.html'
                    },
                    {
                        src: 'lib/client/require.config.js',
                        dest: outputDir + '/require.config.js'
                    },
                    {
                        src: 'lib/client/vendor',
                        dest: outputDir + '/vendor'
                    },
                    {
                        src: 'lib/client/js',
                        dest: outputDir + '/js'
                    }
                ]

            }
        },

        //Angular Constants
        ngconstant: {
            options: {
                templatePath:'angular-config.tpl.ejs'
            },
            dev: {
                dest: 'lib/client/js/config.js',
                name: 'configModule',
                constants: {
                    'shareEndpoint': '/twitter/share',
                    'via': 'dropshape',
                    'shareText': 'Check out this post '
                }
            },
            dist: {
                dest: 'lib/client/js/config.js',
                name: 'configModule',
                constants: {
                    'shareEndpoint': '/twitter/share',
                    'via': 'dropshape',
                    'shareText': 'Check out this post '
                }
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
    //CSS compass compiler
    grunt.loadNpmTasks('grunt-contrib-compass');

    //Copy files tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');

    //Client side configurtion variables.
    grunt.loadNpmTasks('grunt-ng-constant');
};
