const settings = require('./settings.js');
const common = require('./common.js');
const fs = require('fs');
const glob = require('glob');

function moduleQuery(mods) {
  if (typeof mods === 'string') {
    mods = glob.sync(`${mods}/*.json`).map(file =>
      JSON.parse(fs.readFileSync(file))
    );
  } else if (mods === undefined) {
    console.log(`${settings.paths.config}/*.json`)
    mods = glob.sync(`${settings.paths.config}/*.json`).map(file =>
      JSON.parse(fs.readFileSync(file))
    );
  }

  var modules = {};
  mods.forEach((mod) => {
    modules[mod.name] = mod;
  });

  function find(expr) {
    console.log("E", expr);
    var mod;
    if (expr.indexOf('.') !== -1) {
      mod = expr.split('.')[0];
      expr = expr.split('.')[1];
    } else {
      return [];
      //throw new Error('wild card modules not supported (yet)');
    }
    console.log('expr', expr, 'mod', mod)

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
