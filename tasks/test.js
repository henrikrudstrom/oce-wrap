// show line number of spec that failed
const gutil = require('gulp-util');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const cover = require('gulp-coverage');
const coveralls = require('gulp-coveralls');

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
    run(`rm -rf ${settings.paths.dist}/spec`, { silent: true }).exec(done)
  );


  gulp.task('render-tests', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    render.write(settings.paths.dist + '/spec/', render('renderTest', configuredModules));
    done();
  });
  gulp.task('render-js', function(done) {
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    var parts = render('renderJS', configuredModules);
    render.write(settings.paths.dist + '/lib/', parts, { flat: true });
    done();
  });


  gulp.task('copy-spec', function() {
    return gulp.src([
        `${settings.paths.definition}/spec/**/*.js`,
        `${settings.paths.definition}/spec/*.js`
      ]).pipe(rename({ dirname: '' }))
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
      .pipe(jasmine({
        verbose: yargs.argv.verbose,
        includeStackTrace: yargs.argv.verbose,
        reporter
      }))
  });

  gulp.task('diff-ref', function(done) {
    var subpath = yargs.argv.folder;
    var refPath = path.join(settings.paths.dist, 'test-ref', subpath);
    var pth = path.join(settings.paths.dist, subpath);
    if (!subpath)
      return;
    exec('rm -rf ' + refPath, () => exec(`cp -rf ${pth} ${refPath}`, done));
  });
  gulp.task('diff-test', function(done) {
    var subpath = yargs.argv.folder;
    if (!subpath)
      return;
    var refPath = path.join(settings.paths.dist, 'test-ref', subpath)
    var pth = path.join(settings.paths.dist, subpath)
    exec(`diff -r ${refPath} ${pth}`,
      (error, stdout, stderr) => {
        gutil.log(stdout);
        return done();
      }
    )

  })
};
