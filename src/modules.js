const settings = require('./settings.js');
const common = require('./common.js');
const conf = require('./conf.js');
const fs = require('fs');
const glob = require('glob');
const builtins = require('./builtinModule.js');

function moduleQuery(mods) {
  if (typeof mods === 'string') {
    mods = glob.sync(`${mods}/*.json`).map(file =>
      JSON.parse(fs.readFileSync(file))
    );
  } else if (mods === undefined) {
    mods = glob.sync(`${settings.paths.config}/*.json`).map(file =>
      JSON.parse(fs.readFileSync(file))
    );
  }
  mods = [builtins()].concat(mods);

  var modules = {};
  mods.forEach((mod) => {
    conf.mapSources(mod);
    modules[mod.name] = mod;
  });
  var cache = {};
  function find(expr) {
    if (cache.hasOwnProperty(expr))
      return cache[expr];
    var mod;
    if (expr.indexOf('.') !== -1) {
      mod = expr.split('.')[0];
      expr = expr.split('.')[1];
    } else {
      mod = 'builtins';
    }

    var res = common.find(modules[mod], expr, true);
    if (res.length === 1) {
      if (res[0] === 'undefined' || res[0] === null || res[0] === undefined) {
        throw new Error('sholdnt happen');
      }
    }
    cache[expr] = res;
    return res;
  }

  function getModule(name) {
    return modules[name];
  }

  function get(name) {
    var res = find(name);
    if (res.length === 0) return null;
    if (res.length === 1) return res[0];
    throw new Error('headers.get expected one result, got multiple');
  }

  return {
    find,
    get: get,
    getModule
  };
}

module.exports = moduleQuery;
