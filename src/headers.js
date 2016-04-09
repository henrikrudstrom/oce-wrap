const settings = require('./settings.js');
const common = require('./common.js');
const fs = require('fs');

function cleanTypeName(ret) {
  ret = ret.replace(/&|\*/, '');
  ret = ret.replace('const', '');
  ret = ret.trim();
  return ret;
}

function matcher(exp, args, matchValue) {
  if (matchValue === undefined)
    matchValue = true;
  return function(obj) {
    var res = common.match(exp, obj.name);
    if (args === null || args === undefined || obj.cls === 'memfun' || !res)
      return res ? matchValue : !matchValue;
    for (var i = 0; i < args.length; i++) {
      console.log("Aregs", args, "obj", obj)
      if (obj.arguments[i] === undefined){
        res = false;
        break;
      }
      var ares = common.match(args[i], obj.arguments[i].type);
      if (!ares)
        res = ares;
    }
    return res ? matchValue : !matchValue;
  };
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
  var data = JSON.parse(fs.readFileSync(`${settings.paths.headerCache}/${mod}.json`));
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

function find(expr) {
  var mod = expr.replace('Handle_', '').split('_')[0];
  return common.find(getModule(mod), expr, matcher);
}

function get(name) {
  var res = find(name);
  if (res.length === 0) return null;
  if (res.length === 1) return res[0];
  throw new Error('headers.get expected one result, got multiple');
}

module.exports.find = find;
module.exports.get = get;
