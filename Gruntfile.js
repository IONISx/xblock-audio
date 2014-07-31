'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var config = {
        'code': 'audio',
        'static': 'audio/static'
    };

    grunt.initConfig({
        c: config,

        // ## //

        watch: {
            uglify: {
                files: ['<%= c.static %>/script/src/**/*.js'],
                tasks: ['uglify']
            },
            less: {
                files: ['<%= c.static %>/style/src/**/*.less'],
                tasks: ['less', 'cssmin']
            }
        },

        // ## //

        jshint: {
            options: {
                'curly': true,
                'eqeqeq': true,
                'immed': true,
                'latedef': true,
                'newcap': true,
                'noarg': true,
                'noempty': true,
                'unused': true,
                'undef': true,
                'trailing': true,
                'quotmark': 'single',

                'boss': true,
                'eqnull': true
            },
            browser: {
                options: {
                    'browser': true,
                    'jquery': true,
                    'globals': {
                        'AudioXBlock': true,
                        'Handlebars': true,
                        'Howl': true
                    }
                },
                files: {
                    src: [
                        '<%= c.static %>/script/src/**/*.js'
                    ]
                }
            },
            node: {
                options: {
                    'node': true
                },
                files: {
                    src: [
                        'Gruntfile.js'
                    ]
                }
            }
        },

        // ## //

        flake8: {
            python: {
                options: {
                    maxLineLength: 120,
                    hangClosing: false
                },
                src: [
                    'setup.py',
                    '<%= c.code %>/**/*.py'
                ]
            }
        },

        // ## //

        uglify: {
            script: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= c.static %>/script/xblock-audio.min.js': [
                        '<%= c.static %>/script/src/main.js',
                        '<%= c.static %>/script/src/server.js',
                        '<%= c.static %>/script/src/studio.js',
                        '<%= c.static %>/script/src/student.js',
                        '<%= c.static %>/script/src/xblock.js'
                    ],
                    '<%= c.static %>/script/howler.min.js': [
                        'node_modules/howler/howler.js'
                    ],
                    '<%= c.static %>/script/handlebars.min.js': [
                        'node_modules/handlebars/dist/handlebars.js'
                    ]
                }
            }
        },

        // ## //

        less: {
            style: {
                files: {
                    '<%= c.static %>/style/xblock-audio.min.css': '<%= c.static %>/style/src/main.less'
                }
            }
        },

        // ## //

        cssmin: {
            style: {
                options: {
                    report: 'min'
                },
                files: {
                    '<%= c.static %>/style/xblock-audio.min.css': '<%= c.static %>/style/xblock-audio.min.css'
                }
            }
        }
    });

    grunt.registerTask('build', [
        'uglify',
        'less',
        'cssmin'
    ]);

    grunt.registerTask('default', function () {
        grunt.option('force', true);

        grunt.task.run([
            'build',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'jshint',
        'flake8',
        'build'
    ]);
};
