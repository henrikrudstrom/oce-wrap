module.exports = function(gulp) {
  const fs = require('fs');
  const path = require('path');
  const mkdirp = require('mkdirp');
  const yargs = require('yargs');
  const runSequence = require('run-sequence').use(gulp);
  const run = require('gulp-run');
  const gutil = require('gulp-util');
  const settings = require('../src/settings.js');
  //const common = require('./lib/common.js');

  const parseScript = path.join(__dirname, 'parse_headers.py');

  function cacheFile(moduleName) {
    return `${settings.paths.headerCache}/${moduleName}.json`;
  }

  // Parse header for module
  settings.oce.modules.forEach(function(moduleName) {
    gulp.task('parse-headers:' + moduleName, function(done) {
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

  function limitExecution(task, modules, done) {
    // split module names into chunks of size n
    function split(array, n) {
      var spl = [];
      for (var i = 0; i < n; i++) {
        var ii = i; // bind i to this scope.
        spl.push(array.filter((e, index) => index % n === ii));
      }

      return spl;
    }
    var n = 8;

    function cb(error) {
      if (error) done(error);
      n -= 1;
      if (n === 0) done();
    }

    split(modules, n).forEach((mod) => {
      runSequence.apply(this, mod.map(m => task + ':' + m).concat([cb]));
    });
  }

  // Parse all headers
  gulp.task('parse-headers', function(done) {
    // only parse missing modules, or if forced.
    var parseModules = settings.oce.modules.filter(
      (mod) => !fs.existsSync(cacheFile(mod))
    );
    if (parseModules.length > 0)
      return limitExecution('parse-headers', parseModules, done);
    gutil.log('Header cache up to date');
    return done();
  });
};
