const settings = require('./settings.js');
const common = require('./common.js');
const conf = require('./conf.js');
const fs = require('fs');
const glob = require('glob');

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

  var modules = {};
  mods.forEach((mod) => {
    conf.mapSources(mod);
    modules[mod.name] = mod;
  });

  function find(expr) {
    var mod;
    if (expr.indexOf('.') !== -1) {
      mod = expr.split('.')[0];
      expr = expr.split('.')[1];
    } else {
      return ['string', 'bool', 'int', 'double'].filter(type => common.match(expr, type));
      //throw new Error('wild card modules not supported (yet)');
    }
    return common.find(modules[mod], expr, true);
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
