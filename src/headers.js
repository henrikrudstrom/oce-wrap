const settings = require('./settings.js');
const common = require('./common.js');
const fs = require('fs');
const glob = require('glob');

function cleanTypeName(ret) {
  ret = ret.replace(/&|\*/, '');
  ret = ret.replace('const', '');
  ret = ret.trim();
  return ret;
}

function processType(type) {
  // TODO: should be implemented in header_parser.py
  type.declarations = [];
  if (type.cls !== 'class') return type;

  type.declarations = type.constructors.concat(type.members);
  delete type.constructors;
  delete type.members;

  type.declarations.forEach((d) => {
    if (d.returnType) {
      d.returnTypeDecl = d.returnType;
      d.returnType = cleanTypeName(d.returnType);
    }
  });

  return type;
}

function loadModule(mod) {
  var file = `${settings.paths.headerCache}/${mod}.json`;
  if (!fs.existsSync(file)) return null;

  var data = JSON.parse(fs.readFileSync(file));
  data.declarations = data.typedefs
    .concat(data.enums)
    .concat(data.classes)
    .map(processType);

  delete data.typedefs; // TODO: should be implemented in header_parser.py
  delete data.enums;
  delete data.classes;

  return data;
}

var modules = {};

function getModule(mod) {
  if (modules[mod] === undefined)
    modules[mod] = loadModule(mod);

  return modules[mod];
}

function listModules() {
  return glob.sync(`${settings.paths.headerCache}/*.json`)
    .map(file => file.match(/\/(\w+).json/)[1]);
}

function find(expr) {
  var modName = expr.replace('Handle_', '')
    .split('::')[0]
    .split('_')[0];

  var mod = getModule(modName);

  if (!mod) return [];

  return common.find(mod, expr)
    .filter(res => !res.copyConstructor); // TODO: wrong home
}

function get(name) {
  var res = find(name);

  if (res.length === 0) return null;
  if (res.length === 1) return res[0];

  throw new Error('headers.get expected one result, got multiple');
}

module.exports = {
  find,
  get: get,
  getModule,
  listModules
};
