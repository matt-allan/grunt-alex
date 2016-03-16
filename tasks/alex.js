/*
 * grunt-alex
 * https://github.com/yuloh/grunt-alex
 *
 * Copyright (c) 2016 Matt Allan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var alex = require('alex'),
      reporter = require('vfile-reporter');

  grunt.registerMultiTask('alex', 'Catch insensitive, inconsiderate writing.', function() {
    var options = this.options({
      fail: false
    });

    var result = [];

    this.files.forEach(function(f) {

      f.src.filter(function(filepath) {
        var content = grunt.file.read(filepath);
        result.push(alex(content));
      });

      if (!options.fail) {
        grunt.log.write(reporter(result));
        return;
      }

      grunt.fail.warn(reporter(result));
    });
  });

};
