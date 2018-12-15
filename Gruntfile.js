module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            gruntfile: "Gruntfile.js",
            src: ["src/**/*.js"],
            options: {
                esversion: 6,
                node: true,
                '-W053': true,
                '-W083': true
            }
        },
        copy: {
            js: {
                files: [
                    {expand: true, cwd: 'src/controllers/', src: ['**'], dest: 'build/options/controllers/'},
                    {expand: true, cwd: 'src/models/', src: ['**'], dest: 'build/options/models/'},
                    {expand: true, cwd: 'src/services/', src: ['**'], dest: 'build/options/services/'},
                    {src: ['src/services/aws/.aws-lambda.js'], dest: 'build/options/services/aws/aws.js'},
                    {expand: true, cwd: 'src/utils/', src: ['**'], dest: 'build/options/utils/'},
                    {expand: true, cwd: 'src/', src: ['options.js'], dest: 'build/options/'},
                    {expand: true, src: ['package.json'], dest: 'build/'}
                ]
            },
            modules: {
                files: [
                    {expand: true, cwd: 'build', src: ['node_modules/**'], dest: 'build/options/'}
                ]
            }
        },
        exec: {
            install_modules: {
                cwd: 'build/',
                cmd: 'npm install --production'
            },
            upload_options_package: {
                cmd: 'node src/lambdas/upload-options-package.js'
            }
        },
        compress: {
            options_package: {
                options: {
                    archive: 'build/options.zip'
                },
                expand: true,
                cwd: 'build/options/',
                src: ['**/*'],
                dest: '/'
            }
        },
        clean: ['build/']
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('js', ['test', 'copy:js']);
    grunt.registerTask('dist', ['clean', 'js', 'exec:install_modules', 'copy:modules']);
    grunt.registerTask('upload', ['compress', 'exec:upload_options_package']);

    // Default task(s).
    grunt.registerTask('default', ['dist', 'upload']);
    grunt.registerTask('debug', ['test', 'js']);

};
