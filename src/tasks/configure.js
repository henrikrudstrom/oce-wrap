const glob = require('glob');

const gulp = require('gulp');
const run = require('gulp-run');
const gutil = require('gulp-util');

const configure = require('../configure.js');
const settings = require('../settings.js');
require('./parse.js');

gulp.task('configure', ['configure-clean', 'parse-headers'], function(done) {
  const definedModules = glob.sync(`${settings.paths.definition}/modules/*.js`);
  configure(definedModules, settings.paths.config);
  return done();
});

gulp.task('configure-clean', function(done) {
  return run(`rm -rf ${settings.paths.config}`).exec(done);
});
