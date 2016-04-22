var settings = require('../src/settings.js');


//const gulp = require('gulp');
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
      ['swig-clean', 'configure'],
      ['render-swig', 'render-js', 'copy'],
      'swig-cxx', 'swig-hack-handles', done
    );
  });

  gulp.task('build', ['render'], function(done) {
    runSequence(
      'gyp-clean', 'gyp-configure', 'copy-js',
      'gyp-build', 'copy-gyp', done
    );
  });

  gulp.task('dist', ['build'], function(done) {
    runSequence([], done);
  });

  gulp.task('test', function(done) {
    runSequence('test-clean', 'copy-spec', 'render-tests', 'just-test', done);
  });
  gulp.task('test-full', function(done) {
    runSequence('render', 'test', done);
  });

  gulp.task('all', function(done) {
    runSequence('init', 'render', 'build', 'dist', 'test', done);
  });
  gulp.task('copy-swig', function() {
    return gulp.src(`${settings.paths.definition}/modules/**/*.i`, {
      base: `${settings.paths.definition}/modules/`
    }).pipe(gulp.dest(settings.paths.swig));
  });

  gulp.task('copy-sources', function() {
    return gulp.src(`${settings.paths.definition}/modules/**/*.c*`)
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest(settings.paths.cxx));
  });
  gulp.task('copy-headers', function() {
    return gulp.src(`${settings.paths.definition}/modules/**/*.h*`)
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest(settings.paths.inc));
  });
  // gulp.task('copy-spec', function() {
  //   return gulp.src([
  //       `${settings.paths.definition}/modules/**/spec/*.js`,
  //       `${settings.paths.definition}/spec/*.js*`
  //     ])
  //     .pipe(rename({ dirname: '' }))
  //     .pipe(gulp.dest(`${settings.paths.build}/spec`));
  // });
  gulp.task('copy-js', function() {
    return gulp.src(`${settings.paths.definition}/modules/*/*.js`)
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest(`${settings.paths.dist}/lib`));
  });

  gulp.task('copy', function(done) {
    runSequence('copy-swig', 'copy-headers', 'copy-sources', 'copy-js', 'copy-spec', done);
  });

  gulp.task('copy-gyp', function(done) {
    return gulp.src(`${settings.paths.dist}/build/Release/*.node`)
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest(`${settings.paths.dist}/lib/`));
  });
};
