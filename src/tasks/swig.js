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
const common = require('./lib/common.js');
const paths = settings.paths;

//const swig = 'swig';
const flags = '-javascript -node -c++ -DSWIG_TYPE_TABLE=occ.js';
const otherFlags = '-w302,401,314,509,512 -DCSFDB -DHAVE_CONFIG_H -DOCC_CONVERT_SIGNALS'; // TODO:
const include = ['-I/usr/include/node', `-I${settings.oce_include}`];

function runSwig(moduleName, done) {
  const output = path.join(paths.cxxDest, `${moduleName}_wrap.cxx`);
  const input = path.join(paths.swigDest, `${moduleName}/module.i`);
  const includes = include.join(' ');
  mkdirp.sync(path.dirname(output));
  const cmd = `${settings.swig} ${flags} ${otherFlags} ${includes} -o ${output} ${input}`;
  run(cmd).exec(done);
}

gulp.task('swig-clean', (done) =>
  run(`rm -rf ${paths.swigDest}`, { silent: true }).exec(done)
);
// Copy hand written swig .i files from src/swig to build/...
gulp.task('swig-copy', function(done) {
  mkdirp.sync(paths.userSwigDest);
  return run(`cp -r ${paths.userSwigSrc}/* ${paths.userSwigDest}`, { silent: true }).exec(done);
});

gulp.task('swig-render', (done) => {
  settings.buildDepends.forEach((mod) => {
    process.stdout.write(mod + ' ');
    render(mod);
  });
  process.stdout.write('\n');
  done();
});

const async = require('async');
gulp.task('swig-cxx', function(done) {
  async.parallel(
    settings.buildModules.map((mod) => (cb) => runSwig(mod, cb)),
    done
  );
});

gulp.task('swig', ['configure'], (done) =>
  runSequence('swig-clean', ['swig-copy', 'swig-render'], 'swig-cxx', done)
)
