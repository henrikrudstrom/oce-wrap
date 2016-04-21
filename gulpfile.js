const settings = require('./src/settings.js');
settings.initialize({
  paths: {
    build: 'spec/test-proj/build',
    dist: 'spec/test-proj/dist',
    definition: 'spec/test-proj/def'
  }
});
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
// const cover = require('gulp-coverage');
// const coveralls = require('gulp-coveralls');
const gutil = require('gulp-util');
const yargs = require('yargs');
require('./tasks/parse.js')(gulp);

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
  console.log("MYTEST")
  var specSources = ['spec/*Spec.js'];
  var arg = yargs.argv.spec;
  if (arg)
    specSources = `spec/${arg}Spec.js`;
  gulp.src(specSources)
    // .pipe(cover.instrument({
    //   pattern: ['src/**/*.js']
    // }))
    .pipe(jasmine({
      verbose: true,
      includeStackTrace: yargs.argv.verbose,
      reporter
    }))
    // .pipe(cover.gather())
    // .pipe(cover.format({ reporter: 'lcov' }))
    // .pipe(coveralls());
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
