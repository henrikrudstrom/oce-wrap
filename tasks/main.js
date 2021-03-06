var path = require('path');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var settings = require('../src/settings.js');

module.exports = function(gulp) {
  const runSequence = require('run-sequence').use(gulp);
  const rename = require('gulp-rename');

  require('./parse.js')(gulp);
  require('./configure.js')(gulp);
  require('./swig.js')(gulp);
  require('./gyp.js')(gulp);
  require('./test.js')(gulp);

  gulp.task('init', function() {
    runSequence('parse-headers');
  });

  gulp.task('render', function(done) {
    runSequence(
      ['swig-clean', 'configure'], ['render-swig', 'render-js', 'copy'],
      'swig-cxx', 'swig-hack-handles', done
    );
  });

  gulp.task('build', ['render'], function(done) {
    runSequence(
      'gyp-clean', 'gyp-configure', 'copy-js',
      'gyp-build', 'copy-gyp', done
    );
  });
  gulp.task('just-build', function(done) {
    runSequence(
      'copy-swig', 'swig-cxx', 'copy-js', 'gyp-clean', 'gyp-configure',
      'gyp-build', 'copy-gyp', done
    );
  });


  gulp.task('dist-clean', function(done) {
    return gulp.src([
        '../noce/lib', '../noce/spec',
        '../noce/inc', '../noce/src'
      ], { read: false, force: true })
      .pipe(clean({ force: true }));
  });

  gulp.task('dist-copy', function() {
    return gulp.src([
        'build/lib/**/*', 'build/spec/**/*',
        'build/inc/**/*', 'build/src/**/*'
      ], { base: 'build' })
      .pipe(gulp.dest('../noce'));
  });
  gulp.task('dist', function(done) {
    return runSequence('dist-clean', 'dist-copy', done);
  });

  gulp.task('test', function(done) {
    runSequence('test-clean',  'copy-spec', 'render-tests', 'render-class-hierarchy', 'just-test', done);
  });
  gulp.task('test-full', function(done) {
    runSequence('render', 'test', done);
  });

  gulp.task('all', function(done) {
    runSequence('init', 'render', 'build', 'dist', 'test', done);
  });


  function copy(src, ext, dest, flat) {
    var destPath = path.join(settings.paths.build, dest);
    var basePath = path.join(settings.paths.definition, src);
    var srcPath = path.join(basePath, ext);

    return gulp.src(srcPath, { base: basePath })
      .pipe(gulpif(flat, rename({ dirname: '' })))
      .pipe(gulp.dest(destPath));
  }

  gulp.task('copy-swig', function() {
    return copy('modules', '**/*.i', 'swig');
  });

  gulp.task('copy-sources', function() {
    return copy('modules', '**/*.c*', 'src', true);
  });

  gulp.task('copy-headers', function() {
    return copy('modules', '**/*.h*', 'inc', true);
  });

  gulp.task('copy-js', function() {
    return copy('modules', '*/*.js', 'lib', true);
  });

  gulp.task('copy', function(done) {
    runSequence('copy-swig', 'copy-headers', 'copy-sources', 'copy-js', 'copy-spec', done);
  });
};
