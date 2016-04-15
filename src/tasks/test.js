const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const async = require('async');
const runSequence = require('run-sequence');
const gulp = require('gulp');
const run = require('gulp-run');
const render = require('../render.js');
const settings = require('../settings.js');
var rename = require('gulp-rename');
const jasmine = require('gulp-jasmine');
const gutil = require('gulp-util');
const yargs = require('yargs');
var debug = require('gulp-debug');

// show line number of spec that failed
var Reporter = require('jasmine-terminal-reporter');
var reporter = new Reporter({ isVerbose: yargs.argv.verbose });
var oldSpecDone = reporter.specDone;
reporter.specDone = function(result) {
  oldSpecDone(result);
  for (var i = 0; i < result.failedExpectations.length; i++) {
    if (result.failedExpectations[i].stack === undefined) return;
    gutil.log('\n' + result.failedExpectations[i].stack
      .split('\n')
      .filter((l) => !l.includes('node_modules'))
      .join('\n')
    );
  }
};


module.exports.reporter = reporter;
gulp.task('test-clean', (done) =>
  run(`rm -rf ${settings.paths.dist}/spec`, { silent: true }).exec(done)
);


gulp.task('render-tests', function(done) {
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
  render.write(settings.paths.dist + '/spec/', render('renderTest', configuredModules));
  run(
    `cp -rf ${settings.paths.definition}/create.js ${settings.paths.dist}/spec/create.js`
  ).exec(done);
});


gulp.task('copy-spec', function() {
  return gulp.src([
    `${settings.paths.definition}/spec/**/*.js`,
    `${settings.paths.definition}/spec/*.js`
  ])
  .pipe(rename({ dirname: '' }))
  .pipe(gulp.dest(`${settings.paths.dist}/spec`));
});


gulp.task('just-test', ['copy-spec'], function() {
  var specSource = `${settings.paths.dist}/spec/`;
  var arg = yargs.argv.spec;
  if (arg)
    specSource += yargs.argv.spec + 'Spec.js';
  else
    specSource += '**/*Spec.js';
  gulp.src(specSource)
    .pipe(debug({title: 'unicorn:'}))
    .pipe(jasmine({
      verbose: yargs.argv.verbose,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});
