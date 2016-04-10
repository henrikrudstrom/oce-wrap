const settings = require('./settings.js');
const common = require('./common.js');
const fs = require('fs');
const glob = require('glob');

function moduleQuery(mods) {
  if (mods === undefined) {
    glob.sync(`${settings.paths.build}/modules/*.json`).forEach((file) => {
      JSON.parse(fs.readFileSync(file));
    });
  }

  var modules = {};
  mods.forEach((mod) => {
    modules[mod.name] = mod;
  });

  function find(expr) {
    var mod;
    if (expr.indexOf('.') !== -1) {
      mod = expr.split('.')[0];
      expr = expr.split('.')[1];
    } else {
      throw new Error('wild card modules not supported (yet)');
    }
    return common.find(modules[mod], expr, true);
  }

  function get(name) {
    var res = find(name);
    if (res.length === 0) return null;
    if (res.length === 1) return res[0];
    throw new Error('headers.get expected one result, got multiple');
  }

  return {
    find,
    get: get
  };
}
module.exports = moduleQuery;
