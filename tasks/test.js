// show line number of spec that failed
const gutil = require('gulp-util');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const del = require('del');
const exec = require('child_process').exec;
const diff = require('gulp-diff');
const arrify = require('arrify');


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
module.exports = function(gulp) {
  const glob = require('glob');
  const run = require('gulp-run');
  const render = require('../src/render.js');
  const settings = require('../src/settings.js');
  var rename = require('gulp-rename');
  const jasmine = require('gulp-jasmine');

  gulp.task('test-clean', (done) =>
    run(`rm -rf ${settings.paths.build}/spec`, { silent: true }).exec(done)
  );


  gulp.task('render-tests', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    render.write(settings.paths.build + '/spec/', render('spec', configuredModules));
    done();
  });
  gulp.task('render-js', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    var parts = render('js', configuredModules);
    render.write(settings.paths.build + '/lib/', parts, { flat: true });
    done();
  });


  gulp.task('copy-spec', function() {
    console.log(`${settings.paths.build}/spec`)
    return gulp.src([
        `${settings.paths.definition}/spec/**/*.js`,
        `${settings.paths.definition}/spec/*.js`
      ]) //.pipe(rename({ dirname: '' }))
      .pipe(gulp.dest(`${settings.paths.build}/spec`));
  });

  gulp.task('just-test', ['copy-spec'], function() {
    var specSource = `${settings.paths.build}/spec/`;
    var arg = yargs.argv.spec;
    if (arg)
      specSource += yargs.argv.spec + 'Spec.js';
    else
      specSource += '**/*Spec.js';

    console.log(specSource);
    gulp.src(specSource)
      .pipe(jasmine({
        verbose: yargs.argv.verbose,
        includeStackTrace: yargs.argv.verbose,
        reporter
      }))
  });


  function diffTestSubpaths(more) {
    var subpaths = ['swig', 'config', 'spec'].concat(arrify(more));
    if (yargs.argv.folder)
      subpaths = yargs.argv.folder.split(',');
    return subpaths;
  }

  gulp.task('diff-test-clean', function(done) {
    var sources = diffTestSubpaths()
      .map(folder => path.join('.diff-test-ref', folder, '*.*'));
    del.sync('.diff-test-ref/**');

    return done();
  })

  gulp.task('diff-test-init', ['diff-test-clean'], function() {
    var sources = diffTestSubpaths('src')
      .map(folder => path.join(settings.paths.build, folder, '**/*'));

    return gulp.src(sources, {
        base: 'build/',
      })
      .pipe(gulp.dest('.diff-test-ref'))
  });


  gulp.task('diff-test', function() {
    var refs = diffTestSubpaths()
      .map(folder => path.join('.diff-test-ref', folder, '**/*'));

    return gulp.src(refs, {
      base: '.diff-test-ref/'
    })
    .pipe(diff(settings.paths.build))
    .pipe(diff.reporter({ fail: false }));
  });
};
