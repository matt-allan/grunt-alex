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
      reporter = require('vfile-reporter'),
      findUp = require('find-up'),
      readPkgUp = require('read-pkg-up');

  grunt.registerMultiTask('alex', 'Catch insensitive, inconsiderate writing.', function() {
    var options = this.options({
      fail: false
    });

    var done = this.async();
    var files = this.files;
    var runAlex = function (files, allow) {
      var result = [];
      files.forEach(function(f) {

        f.src.filter(function(filepath) {
          var content = grunt.file.read(filepath);
          result.push(alex(content, allow));
        });

        if (!options.fail) {
          grunt.log.write(reporter(result));
        } else {
          grunt.fail.warn(reporter(result));
        }
        return done();
      });
    };

    findUp('.alexrc').then(function (alexRcPath) {
      if (!alexRcPath) {
        return readPkgUp().then(function (pkg) {

          if (pkg && pkg.pkg && pkg.pkg.alex && pkg.pkg.alex.allow) {
            return runAlex(files, pkg.pkg.alex.allow);
          }
          return runAlex(files, []);
        });
      }
      var alexRcContents = JSON.parse(grunt.file.read(alexRcPath));
      var allow = alexRcContents.allow ? alexRcContents.allow : [];
      return runAlex(files, allow);
    });
  });

};
