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

const jasmine = require('gulp-jasmine');
const gutil = require('gulp-util');
const yargs = require('yargs');


// show line number of spec that failed
var Reporter = require('jasmine-terminal-reporter');
var reporter = new Reporter({ isVerbose: false });
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

gulp.task('test-generated', function() {
  var specPath = `${settings.paths.dist}/spec/generated`;
  var specSources = [`${specPath}/**/*Spec.js`];

  var arg = yargs.argv.spec;
  if (arg)
    specSources = [`${specPath}/${arg}Spec.js`];
  gulp.src(specSources)
    .pipe(jasmine({
      verbose: yargs.argv.verbose,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});

gulp.task('test-copied', function() {
  var specPath = `${settings.paths.dist}/spec/`;
  var specSources = [`${specPath}/*Spec.js`];

  var arg = yargs.argv.spec;
  if (arg)
    specSources = [`${specPath}/${arg}Spec.js`];
  gulp.src(specSources)
    .pipe(jasmine({
      verbose: false,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});

gulp.task('render-tests', function(done) {
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
  render.write(settings.paths.dist + '/spec/generated/', render('renderTest', configuredModules));
  run(
    `cp -rf ${settings.paths.definition}/create.js ${settings.paths.dist}/spec/generated/create.js`
  ).exec(done);
});
