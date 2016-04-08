'use-strict';
var runSequence = require('run-sequence');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var hashFiles = require('hash-files');
const yargs = require('yargs');

function moduleTask(name, mName) {
  if (Array.isArray(mName)) {
    return mName.map((m) => moduleTask(name, m));
  }
  if (Array.isArray(name)) {
    return name.map((n) => moduleTask(n, mName));
  }
  return name + ':' + mName;
}

module.exports.writeJSON = function(dest, data, done) {
  mkdirp.sync(path.dirname(dest));
  var src = JSON.stringify(data, null, 2);
  if (typeof done !== 'function'){
    //console.log("Sync", dest)
    return fs.writeFileSync(dest, src);
  }
  //console.log("ASync", dest)
  return fs.writeFile(dest, src, done);
}

module.exports.moduleTask = moduleTask;


module.exports.runIfChanged = function(files, name, cb) {
  var hashPath = `tmp/hash/${name}.hash`;
  var hashValue = undefined;

  function hasChanged(fn) {
    var currentHash;
    if (yargs.argv.force) return fn(false, true);
    if (!files.every(fs.existsSync)) return fn(false, true);

    if (!fs.existsSync(hashPath)) return fn(false, true);
    currentHash = fs.readFileSync(hashPath);
    hashFiles({
      files,
      noGlob: true
    }, function(error, hash) {
      if (error) return fn(error, false);
      hashValue = hash;
      if (hash.toString() !== currentHash.toString()) {
        fn(false, true);
      } else {
        fn(false, false);
      }
      return null;
    });
    return null;
  }

  function runTaskAndHash() {
    return runSequence(name, function(error) {
      if (error) return cb(error);
      mkdirp.sync('tmp/hash');
      fs.writeFile(hashPath, hashValue, function(error2) {
        if (error2) return cb(error2);
        return cb();
      });
      return null;
    });
  }

  hasChanged(function(error, run) {
    if (error) return cb(error);
    if (!run) {
      return cb();
    }
    return runTaskAndHash();
  });
};



module.exports.limitExecution = function(task, modules, done) {
  function split(array, n) {
    var spl = [];
    for (var i = 0; i < n; i++) {
      var ii = i;
      // TODO: declared function inside loop...
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
    runSequence.apply(this, moduleTask(task, mod).concat([cb]));
  });
};
