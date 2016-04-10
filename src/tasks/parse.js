'use-strict';
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const yargs = require('yargs');

const gulp = require('gulp');
const run = require('gulp-run');
const gutil = require('gulp-util');

//const depend = require('../depend.js');
const settings = require('../settings.js');
const common = require('./lib/common.js');

const parseScript = path.join(__dirname, 'python/parse_headers.py');
//const parseCmd = `python src/tasks/python/parse_headers.py`;

function cacheFile(moduleName) {
  return `${settings.paths.headerCache}/${moduleName}.json`;
}

// Read dependencies from cached pygccxml output
// gulp.task('init-dependencies', function(done) {
//   const depFile = 'config/depends.json';
//   if (fs.existsSync(depFile)) {
//     gutil.log('dependencies ok')
//     return done();
//   }
//
//   return run(`rm -rf ${depFile}`).exec((error) => {
//     if (error) return done(error);
//     var deps = {};
//     var reader = depend.reader();
//     glob.sync(`${paths.headerCache}/*.json`).forEach((file) => {
//       const mod = path.basename(file).replace('.json', '');
//       deps[mod] = reader.requiredModules(mod, false);
//     });
//     fs.writeFile(depFile, JSON.stringify(deps, null, 2), done);
//   });
// });

// Parse header for module
settings.oce.modules.forEach(function(moduleName) {
  gulp.task(common.moduleTask('parse-headers', moduleName), function(done) {
    mkdirp.sync(settings.paths.headerCache);
    var args = [
      moduleName,
      settings.oce.include,
      settings.paths.data,
      cacheFile(moduleName)
    ].join(' ');

    var cmd = `python ${parseScript} ${args}`;

    return run(cmd).exec(done);
  });
});

// Parse all headers
gulp.task('parse-headers', function(done) {
  // only parse missing modules, or if forced.
  var parseModules = settings.oce.modules.filter(
    (mod) => !fs.existsSync(cacheFile(mod)) || yargs.argv.force
  );
  if (parseModules.length > 0)
    return common.limitExecution('parse-headers', parseModules, done);
  gutil.log('Header cache up to date');
  return done();
});
