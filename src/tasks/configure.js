const glob = require('glob');

const gulp = require('gulp');
const run = require('gulp-run');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const render = require('../render.js');
const configure = require('../configure.js');
const settings = require('../settings.js');
require('./parse.js');

gulp.task('configure', ['configure-clean', 'parse-headers'], function(done) {
  const definedModules = glob.sync(`${settings.paths.definition}/modules/*.js`)
  configure(definedModules, settings.paths.config);
  return done();
});

gulp.task('configure-clean', function(done) {
  return run(`rm -rf ${settings.paths.config}`).exec(done);
});

gulp.task('render-swig', function(done) {
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
  render.write(settings.paths.swig, render(configuredModules));
  return done();
});

gulp.task('render', function(done) {
  runSequence('configure', 'render-swig');
  return done();
});
