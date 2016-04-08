'use-strict';
const fs = require('fs');
const mkdirp = require('mkdirp');

const gulp = require('gulp');
const runSequence = require('run-sequence');
const run = require('gulp-run');
const gutil = require('gulp-util');

const settings = require('../settings.js');
const depend = require('../depend.js');
const paths = settings.paths;
const common = require('./lib/common.js');

function getToolkit(moduleName) {
  return Object.keys(settings.toolkits).filter((tk) =>
    settings.toolkits[tk].indexOf(moduleName) >= 0
  )[0];
}

function toolkitDeps(moduleName) {
  return depend.toolkitDepends(moduleName)
    .map((s) => `      "-l${s}"`).join(',\n');
}
module.exports.tool = toolkitDeps;

function writeConfig(moduleName, buildPath) {
  var src = `{
  "targets": [{
    "target_name":"${moduleName}",
    "sources": ["../../src/${moduleName}_wrap.cxx"],
    "include_dirs": ["${settings.oce_include}"],
    "libraries": [
      "-L${settings.oce_lib}",
${toolkitDeps(moduleName)}
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




settings.modules.forEach(function(moduleName) {
  const buildPath = `${paths.gyp}/${moduleName}`;
  const configPath = `${paths.configDest}/${moduleName}.json`;
  var depends = settings.depends[moduleName];


  function mTask(name, mName) {
    if (mName === undefined)
      mName = moduleName;
    return common.moduleTask(name, mName);
  }


  gulp.task(mTask('gyp-clean'), function(done) {
    if (!fs.existsSync(buildPath)) return done();
    run(`rm -rf ${buildPath}`).exec(done);
    return undefined;
  });

  gulp.task(mTask('gyp-configure'), function(done) {
    writeConfig(moduleName, buildPath);
    run('node-gyp configure', {
      cwd: buildPath,
      verbosity: 0
    }).exec(done);
  });

  gulp.task(mTask('gyp-build'), [mTask('gyp-configure')], function(done) {
    run('node-gyp build', {
      cwd: buildPath,
      verbosity: 1
    }).exec(done);
  });

  gulp.task(mTask('gyp-dist'), function(done) {
    mkdirp.sync(`${paths.dist}/lib/`);
    var cmd = `cp ${buildPath}/build/Release/${moduleName}.node ${paths.dist}/lib/`;
    run(cmd).exec(done);
  });

  gulp.task(mTask('gyp'), function(done) {
    runSequence(mTask('gyp-build'), mTask('gyp-dist'), done);
  });

  gulp.task(mTask('gyp-deps'), function(done) {
    common.limitExecution('gyp', depends, done);
  });
});
