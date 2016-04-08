'use-strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const execSync = require('child_process').execSync;

const gulp = require('gulp');
const runSequence = require('run-sequence');
const run = require('gulp-run');
const gutil = require('gulp-util');

const render = require('../renderSwig.js');
const configure = require('../configure.js');
const settings = require('../settings.js');
const depend = require('../depend.js');
const writeModules = require('../module.js').writeModules;
const common = require('./lib/common.js');
const paths = settings.paths;

gulp.task('configure-clean', function(done) {
  return run(`rm -rf ${paths.configDest}`).exec(done);
})



gulp.task('conf', function(){
  var conf = require('../src/configure/configure.js')
  conf(glob.sync('src/configure/modules/*.js'), `${settings.paths.build}/modules/`);
})

gulp.task('configure', ['configure-clean', 'init'], function(done) {
  var depends = settings.buildModules
    .map((mod) => settings.depends[mod])
    .reduce((a, b) => a.concat(b));
  settings.buildDepends.forEach((mod) => {
    var configPath = `${paths.configDest}/${mod}.json`;
    var data = configure(mod);
    process.stdout.write(mod + ' ');
    common.writeJSON(configPath, data);
  });
  process.stdout.write('\n');
  configure.configureMissing();

  settings.buildDepends.forEach((mod) => {
    process.stdout.write(mod + ' ');
    var configPath = `${paths.configDest}/${mod}.json`;
    var data = configure.processConfig(mod);

  });


  return done();
});

gulp.task('newTree', function(done) {

  writeModules();
});
