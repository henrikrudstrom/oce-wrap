// show line number of spec that failed
const gutil = require('gulp-util');
const yargs = require('yargs');
const path = require('path');
const del = require('del');
const diff = require('gulp-diff');
const arrify = require('arrify');
const glob = require('glob');
const run = require('gulp-run');
const mocha = require('gulp-mocha');

module.exports = function(gulp) {
  const render = require('../src/render.js');
  const settings = require('../src/settings.js');
  const testLib = require('../src/testLib');

  gulp.task('test-clean', (done) =>
    run(`rm -rf ${settings.paths.build}/spec`, { silent: true }).exec(done)
  );

  gulp.task('render-tests', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    render.write(settings.paths.build + '/spec/', render('spec', configuredModules));
    done();
  });

  gulp.task('render-class-hierarchy', function(done){
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    var inheritance = testLib.classHierarchy(configuredModules);
    console.log(inheritance)
  });

  gulp.task('render-js', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    var parts = render('js', configuredModules);
    render.write(settings.paths.build + '/lib/', parts, { flat: true });
    done();
  });

  gulp.task('copy-spec', function() {
    return gulp.src([
      `${settings.paths.definition}/spec/**/*.js`,
      `${settings.paths.definition}/spec/*.js`
    ])
    .pipe(gulp.dest(`${settings.paths.build}/spec`));
  });

  gulp.task('just-test', ['copy-spec'], function () {
    var specSource = `${settings.paths.build}/spec/`;
    var arg = yargs.argv.spec;
    if (arg)
      specSource += yargs.argv.spec + 'Spec.js';
    else
      specSource += '**/*Spec.js';
    console.log("run tests: " + specSource)
    return gulp.src(specSource, { read: false })
      // gulp-mocha needs filepaths so you can't have any plugins before it
      .pipe(mocha({ reporter: 'spec', timeout: 10000 })
    );
  });
// ----------------------------------------------------------------------------
// Diff testing
// run `gulp diff-test-init` to make a copy of the current output before you
// make a change and render the output.
// Afterwards run `gulp diff-test` to output the changes to
// the config/swig/spec or cxx files
// ----------------------------------------------------------------------------

  function diffTestSubpaths(more) {
    var subpaths = ['swig', 'config', 'spec'].concat(arrify(more));
    if (yargs.argv.folder)
      subpaths = yargs.argv.folder.split(',');
    return subpaths;
  }

  gulp.task('diff-test-clean', function(done) {
    diffTestSubpaths()
      .forEach(folder => path.join('.diff-test-ref', folder, '*.*'));
    del.sync('.diff-test-ref/**');

    return done();
  });

  gulp.task('diff-test-init', ['diff-test-clean'], function() {
    var sources = diffTestSubpaths('src')
      .map(folder => path.join(settings.paths.build, folder, '**/*'));

    return gulp.src(sources, {
        base: 'build/'
      })
      .pipe(gulp.dest('.diff-test-ref'));
  });

  gulp.task('diff-test', function() {
    var refs = diffTestSubpaths()
      .map(folder => path.join('.diff-test-ref', folder, '**/*'));

    return gulp.src(refs, {
      base: '.diff-test-ref/'
    })
    .pipe(diff(settings.paths.build))
    .pipe(diff.reporter({ fail: false, compact: true }));
  });
};
