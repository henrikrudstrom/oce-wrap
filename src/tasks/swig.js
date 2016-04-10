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

//const swig = 'swig';
const flags = '-javascript -node -c++ -DSWIG_TYPE_TABLE=occ.js';
const otherFlags = '-w302,401,314,509,512 -DCSFDB -DHAVE_CONFIG_H -DOCC_CONVERT_SIGNALS'; // TODO:
const include = ['-I/usr/include/node', `-I${settings.oce.include}`];

function runSwig(moduleName, done) {
  const output = path.join(settings.paths.cxx, `${moduleName}_wrap.cxx`);
  const input = path.join(settings.paths.swig, `${moduleName}/module.i`);
  const includes = include.join(' ');
  mkdirp.sync(path.dirname(output));
  const cmd = `${settings.swig} ${flags} ${otherFlags} ${includes} -o ${output} ${input}`;
  run(cmd).exec(done);
}

gulp.task('swig-clean', (done) =>
  run(`rm -rf ${settings.paths.swig}`, { silent: true }).exec(done)
);

// Copy hand written swig .i files from module folder
gulp.task('swig-copy', function(done) {
  var modules = settings.build.modules.concat('common');
  async.parallel(modules.map((mod) => (cb) => {
    var src = path.join(settings.paths.definition, 'modules', mod)
    var dest = path.join(settings.paths.swig, mod);
    if (!fs.existsSync(src)) return cb();
    mkdirp.sync(dest);
    run(
      `cp ${src}/*.i ${dest}/`, { silent: false }
    ).exec(cb);
  }), done);
  // return run(
  //   `cp -rf ${settings.paths.definition}/*/*.i ${settings.paths.swig}/user/`, { silent: true }
  // ).exec(done);
});

gulp.task('swig-cxx', function(done) {
  async.parallel(
    settings.build.modules.map((mod) => (cb) => runSwig(mod, cb)),
    done
  );
});

gulp.task('render-swig', function(done) {
  const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
  render.write(settings.paths.swig, render(configuredModules));
  return done();
});

gulp.task('swig', function(done) {
  runSequence('swig-clean', 'configure', 'render-swig', 'swig-copy', 'swig-cxx', done);
});
