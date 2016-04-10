'use-strict';
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const async = require('async');
const runSequence = require('run-sequence');
const gulp = require('gulp');
const run = require('gulp-run');
const render = require('../render.js');
const settings = require('../settings.js');
const exec = require('child_process').exec;

const flags = '-javascript -node -c++ -DSWIG_TYPE_TABLE=occ.js';
const otherFlags = '-w302,401,314,509,512 -DCSFDB -DHAVE_CONFIG_H -DOCC_CONVERT_SIGNALS'; // TODO:
const include = ['-I/usr/include/node', `-I${settings.oce.include}`];

function runSwig(moduleName, done) {
  const output = path.join(settings.paths.cxx, `${moduleName}_wrap.cxx`);
  const input = path.join(settings.paths.swig, `${moduleName}/module.i`);
  const includes = include.join(' ');
  mkdirp.sync(path.dirname(output));
  const cmd = `${settings.swig} ${flags} ${otherFlags} ${includes} -o ${output} ${input}`;
  exec(cmd, done);
}

gulp.task('swig-clean', (done) =>
  run(`rm -rf ${settings.paths.swig}`, { silent: true }).exec(done)
);

// Copy hand written swig .i files from module folder
gulp.task('swig-copy', function(done) {
  var modules = settings.build.modules.concat('common');
  async.parallel(modules.map((mod) => (cb) => {
    var src = path.join(settings.paths.definition, 'modules', mod);
    var dest = path.join(settings.paths.swig, mod);
    if (!fs.existsSync(src)) return cb();
    mkdirp.sync(dest);
    return run(
      `cp ${src}/*.i ${dest}/`, { silent: false }
    ).exec(cb);
  }), done);
});

gulp.task('swig-cxx', function(done) {
  async.parallel(
    settings.build.modules.map((mod) => (cb) => runSwig(mod, cb)),
    done
  );
});

gulp.task('render-swig', function(done) {
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
  render.write(settings.paths.swig, render('renderSwig', configuredModules));
  return done();
});

gulp.task('tests-clean', (done) =>
  run(`rm -rf ${settings.paths.dist}/tests`, { silent: true }).exec(done)
);
