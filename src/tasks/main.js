require('./parse.js');
require('./configure.js');
require('./swig.js');
require('./gyp.js');
require('./test.js');


const runSequence = require('run-sequence');
const gulp = require('gulp');

gulp.task('init', function() {
  runSequence('parse-headers');
});

gulp.task('render', function(done) {
  runSequence(['swig-clean', 'configure'], 'render-swig', 'swig-copy', 'swig-cxx', done);
});

gulp.task('build', ['render'], function(done) {
  runSequence('gyp-clean', 'gyp-configure', 'gyp-build', 'gyp-dist', 'render-tests', done);
});

gulp.task('dist', ['build'], function(done) {
  runSequence([], done);
});

gulp.task('test', function(done) {
  runSequence('render-tests', 'test-generated', done);
});

gulp.task('all', function(done) {
  runSequence('init', 'render', 'build', 'dist', 'test', done);
});
