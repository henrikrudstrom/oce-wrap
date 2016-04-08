const glob = require('glob');

const gulp = require('gulp');
const run = require('gulp-run');
const gutil = require('gulp-util');
const render = require('../render.js');
const configure = require('../configure.js');
const settings = require('../settings.js');
const paths = settings.paths;



gulp.task('configure', function(done){
  const definedModules = glob.sync(`${settings.paths.definition}/modules/*.js`)
  configure(definedModules, settings.paths.config);
  return done();
});


gulp.task('configure-clean', function(done) {
  return run(`rm -rf ${paths.config}`).exec(done);
});

gulp.task('render-swig', function(done){
  console.log("REnder", `${settings.paths.config}/*.json`)
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`)
  console.log(configuredModules);
  render.write(settings.paths.swig, render(configuredModules))

  return done();
});