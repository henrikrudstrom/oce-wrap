const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const async = require('async');
const run = require('gulp-run');
const render = require('../render.js');
const settings = require('../settings.js');
const headers = require('../headers.js');
const exec = require('child_process').exec;

module.exports = function(gulp) {
  const flags = '-javascript -node -c++ -debug-tmused -DSWIG_TYPE_TABLE=occ.js';
  const otherFlags = '-w302,401,314,509,512 -DCSFDB -DHAVE_CONFIG_H -DOCC_CONVERT_SIGNALS'; // TODO:
  const include = ['-I/usr/include/node', `-I${settings.oce.include}`];

  function runSwig(moduleName, done) {
    const output = path.join(settings.paths.cxx, `${moduleName}_wrap.cxx`);
    const input = path.join(settings.paths.swig, `${moduleName}/module.i`);
    const includes = include.join(' ');
    mkdirp.sync(path.dirname(output));
    const cmd = `${settings.swig} ${flags} ${otherFlags} ${includes} -o ${output} ${input}`;
    console.log(cmd)
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
      var swig = path.join(settings.paths.swig, mod);
      var cxx = path.join(settings.paths.cxx);
      var inc = path.join(settings.paths.inc);

      if (!fs.existsSync(src)) return cb();
      mkdirp.sync(swig);
      mkdirp.sync(cxx);
      mkdirp.sync(inc);
      return run(
        `cp -f ${src}/*.i ${swig}/\ncp -f ${src}/*.c* ${cxx}/\ncp -f ${src}/*.h* ${inc}/`, { silent: false }
      ).exec(cb);
    }), done);
  });

  gulp.task('swig-cxx', function(done) {
    async.parallel(
      settings.build.modules.map((mod) => (cb) => runSwig(mod, cb)),
      done
    );
  });


  var replace = require('gulp-replace');
  gulp.task('swig-hack-handles', function() {
    var expr = /result = \(\w+_\w+ \*\)new \w+_\w+\(\(.*/g;
    gulp.src([`${settings.paths.cxx}/*_wrap.cxx`])
      .pipe(replace(expr, str => {
        var clsName = str.match(/\w+_\w+/)[0];
        if (clsName.startsWith('Handle_'))
          return str;
        if (!headers.get('Handle_' + clsName))
          return str;
        // TODO: swig should handle this somehow.
        var statement = `
    // hacked
    Handle_${clsName} *handle;
    handle = (Handle_${clsName} *)new Handle_${clsName}((${clsName} const *)(result));
    self->ToObject()->Set(
      SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewFunctionPtrObj(handle, SWIGTYPE_p_Handle_${clsName}));`;

        return str + statement;
      }))
      .pipe(gulp.dest(settings.paths.cxx));
  });

  gulp.task('render-swig', function(done) {
    const configuredModules = settings.build.modules
      .filter(mod => !fs.existsSync(`${settings.paths.definition}/modules/${mod}/module.i`))
      .map(mod => path.join(settings.paths.config, mod + '.json'));

    render.write(settings.paths.swig, render('renderSwig', configuredModules));
    return done();
  });

  gulp.task('tests-clean', (done) =>
    run(`rm -rf ${settings.paths.dist}/tests`, { silent: true }).exec(done)
  );
};
