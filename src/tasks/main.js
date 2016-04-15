require('./parse.js');
require('./configure.js');
require('./swig.js');
require('./gyp.js');
require('./test.js');
var settings = require('../settings.js');
var rename = require('gulp-rename');



const runSequence = require('run-sequence');
const gulp = require('gulp');

gulp.task('init', function() {
  runSequence('parse-headers');
});

gulp.task('render', function(done) {
  runSequence(['swig-clean', 'configure'], 'render-swig', 'copy', 'swig-cxx', 'swig-hack-handles', done);
});

gulp.task('build', ['render'], function(done) {
  runSequence('gyp-clean', 'gyp-configure', 'gyp-build', 'copy-gyp', 'render-tests', done);
});

gulp.task('dist', ['build'], function(done) {
  runSequence([], done);
});

gulp.task('test', function(done) {
  runSequence('test-clean', 'copy-spec', 'render-tests', 'just-test', done);
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
gulp.task('copy-spec', function() {
  return gulp.src([
    `${settings.paths.definition}/modules/**/spec/*.js`,
    `${settings.paths.definition}/spec/*.js`
  ])
  .pipe(rename({ dirname: '' }))
  .pipe(gulp.dest(`${settings.paths.dist}/spec`));
});
gulp.task('copy-js', function() {
  return gulp.src(`${settings.paths.definition}/modules/**/lib/*.js`)
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(`${settings.paths.dist}/lib`));
});

gulp.task('copy', function(done) {
  runSequence('copy-swig', 'copy-headers', 'copy-sources', 'copy-js', 'copy-spec', done);
});

gulp.task('copy-gyp', function(done) {
  return gulp.src(`${settings.paths.gyp}/*/build/Release/*.node`)
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(`${settings.paths.dist}/lib/`));
});

//
//
//
// gulp.task('swig-copy', function(done) {
//   var modules = settings.build.modules.concat('common');
//   async.parallel(modules.map((mod) => (cb) => {
//     var src = path.join(settings.paths.definition, 'modules', mod);
//     var swig = path.join(settings.paths.swig, mod);
//     var cxx = path.join(settings.paths.cxx);
//     var inc = path.join(settings.paths.inc);
//
//     if (!fs.existsSync(src)) return cb();
//     mkdirp.sync(swig);
//     mkdirp.sync(cxx);
//     mkdirp.sync(inc);
//     return run(
//       `cp -f ${src}/*.i ${swig}/\ncp -f ${src}/*.c* ${cxx}/\ncp -f ${src}/*.h* ${inc}/`, { silent: false }
//     ).exec(cb);
//   }), done);
// });
