'use-strict';
const path = require('path');
const mkdirp = require('mkdirp');
const runSequence = require('run-sequence');
const gulp = require('gulp');
const run = require('gulp-run');

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
  mkdirp.sync(`${settings.paths.swig}/user/`);
  return run(
    `cp -r ${settings.paths.definition}/*.i ${settings.paths.swig}/user/`, { silent: true }
  ).exec(done);
});

const async = require('async');
gulp.task('swig-cxx', function(done) {
  async.parallel(
    settings.build.modules.map((mod) => (cb) => runSwig(mod, cb)),
    done
  );
});
