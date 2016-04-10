'use-strict';
const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');

const gulp = require('gulp');
const runSequence = require('run-sequence');
const run = require('gulp-run');
const gutil = require('gulp-util');

const settings = require('../settings.js');
const modules = require('../modules.js')();
const depend = require('../dependencies.js');
const paths = settings.paths;
const common = require('./lib/common.js');

var reader = depend();

function toolkitDeps(mod) {
  return reader.toolkitDepends(mod)
    .map((s) => `      "-l${s}"`).join(',\n');
}
module.exports.tool = toolkitDeps;

function writeConfig(mod, buildPath) {
  var src = `{
  "targets": [{
    "target_name":"${mod.name}",
    "sources": ["../../cxx/${mod.name}_wrap.cxx"],
    "include_dirs": ["${settings.oce.include}"],
    "libraries": [
      "-L${settings.oce.lib}",
${toolkitDeps(mod)}
    ],
    "cflags": [
      "-DCSFDB", "-DHAVE_CONFIG_H", "-DOCC_CONVERT_SIGNALS",
      "-D_OCC64", "-Dgp_EXPORTS", "-Os", "-DNDEBUG", "-fPIC",
      "-fpermissive",
      "-DSWIG_TYPE_TABLE=occ.js"
    ],
    "cflags!": ["-fno-exceptions"],
    "cflags_cc!": ["-fno-exceptions"]
  }]
}`;
  mkdirp.sync(buildPath);
  fs.writeFileSync(`${buildPath}/binding.gyp`, src);
}

function configureModule(modName, done) {
  const buildPath = `${paths.gyp}/${modName}`;
  console.log(modName);
  var mod = modules.getModule(modName);
  console.log(mod.name)
  writeConfig(mod, buildPath);
  run('node-gyp configure', {
    cwd: buildPath,
    verbosity: 0
  }).exec(done);
}

gulp.task('gyp-clean', function(done) {
  if (!fs.existsSync(paths.gyp)) return done();
  return run(`rm -rf ${paths.gyp}`).exec(done);
});

gulp.task('gyp-configure', function(done) {
  return async.parallel(
    settings.build.modules.map(mod => cb => {
      configureModule(mod, cb);
    }),
    done
  );
});
var exec = require('child_process').exec;
gulp.task('gyp-build', function(done) {
  return async.parallel(
    settings.build.modules.map(mod => cb => {
      const buildPath = `${paths.gyp}/${mod}`;
      exec('node-gyp build', { cwd: buildPath }, cb);
      // run('node-gyp build', {
      //   cwd: buildPath,
      //   verbosity: 1
      // }).exec(cb);
    }),
    done
  );
});

gulp.task('gyp-dist', function(done) {
  return async.parallel(
    settings.build.modules.map(mod => cb => {
      const buildPath = `${paths.gyp}/${mod}`;
      mkdirp.sync(`${paths.dist}/lib/`);
      var cmd = `cp ${buildPath}/build/Release/${mod}.node ${paths.dist}/lib/`;
      run(cmd).exec(cb);
    }),
    done
  );
});
