const settings = require('./src/settings.js');
settings.initialize();
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const gutil = require('gulp-util');
const yargs = require('yargs');
require('./src/tasks/parse.js');





// show line number of spec that failed
var Reporter = require('jasmine-terminal-reporter');
var reporter = new Reporter({ isVerbose: true });
var oldSpecDone = reporter.specDone;
reporter.specDone = function(result) {
  oldSpecDone(result);
  for (var i = 0; i < result.failedExpectations.length; i++) {
    gutil.log('\n' + result.failedExpectations[i].stack
      .split('\n')
      .filter((l) => !l.includes('node_modules'))
      .join('\n')
    );
  }
};
module.exports.reporter = reporter;

gulp.task('test', function() {
  var specSources = ['spec/*Spec.js'];
  var testArgs = yargs.argv._.splice(2);
  if(testArgs.length > 0)
    specSources = testArgs.map((arg) => `spec/${arg}Spec.js`);
  gulp.src(specSources)
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});

gulp.task('test-conf', function() {
  gulp.src(['spec/confSpec.js', 'spec/dependSpec.js'])
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});

gulp.task('test-render', function() {
  gulp.src(['spec/renderSpec.js'])
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }));
});