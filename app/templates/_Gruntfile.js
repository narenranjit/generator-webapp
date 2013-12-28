'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            compass: {
                files: ['<%= sourceDir.styles %>/**/*.scss'],
                tasks: ['compass']
            },
            jst: {
                files: ['<%= sourceDir.templates %>/**/*.tmpl'],
                tasks: ['jst']
            },
            js: {
                files: [ '<%= sourceDir.scripts %>/**/*.js'],
                tasks: 'browserify2'
            },
            options: {
                nospawn: true,
                livereload: {
                    port: LIVERELOAD_PORT
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                directory: './public'

            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, './public')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%%= connect.options.port %>'
            }
        },
        browserify2: {
            dev: {
                entry: './<%= sourceDir.scripts %>/app.js',
                compile: './<%= destDir.scripts %>/app.js',
                debug: true,
                options: {
                    expose: {
                        files: [
                            {
                                cwd: '<%= sourceDir.scripts %>/views/',
                                src: ['**/*.js'],
                                dest: 'views/'
                            },
                            {
                                cwd: '<%= sourceDir.scripts %>/models/',
                                src: ['**/*.js'],
                                dest: 'models/'
                            },
                            {
                                cwd: '<%= sourceDir.scripts %>/collections/',
                                src: ['**/*.js'],
                                dest: 'collections/'
                            }
                        ]
                    }
                }
            }
        },

        jst: {
            compile: {
                options: {
                    namespace: 'App.tmpl',
                    prettify: true,
                    amdWrapper: false,
                    processName: function (filename) {
                        var fullName = filename.split('<%= sourceDir.templates %>/');
                        var changedName = fullName[1].replace(/(\-[a-z])/g, function ($1) {return $1.toUpperCase().replace('-', ''); });
                        return changedName.replace('.tmpl', '');
                    }
                },
                files: {
                    '<%= destDir.scripts %>/templates.js': ['<%= sourceDir.templates %>/**/*.tmpl']
                }
            }
        },

        compass: {
            dev: {
                options: {
                    sassDir: '<%= sourceDir.styles %>',
                    cssDir: '<%= destDir.styles %>',
                    imagesDir: '<%= destDir.styles %>/assets/images',
                    javascriptsDir: '<%= destDir.scripts %>',
                    fontsDir: '<%= destDir.styles %>/assets/fonts',
                    environment: 'dev',
                    outputStyle: 'expanded',
                    relativeAssets: true
                }
            }
        }
    });

    grunt.registerTask('server', ['connect:livereload', 'open', 'watch']);


    grunt.registerTask('default', ['watch']);
};
