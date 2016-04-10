const settings = require('./settings.js');
const extend = require('extend');
module.exports = function typedict(mods) {
  if (mods === undefined)
    mods = settings.build.modules;
  var dict = {};
  mods.forEach((mod) => {
    mod.declarations.forEach((decl) => {
      dict[decl.key] = `${mod.name}.${decl.name}`;
    });
  });
  extend(dict, {
    Standard_Real: 'double',
    Standard_Boolean: 'bool',
    Standard_CString: 'string',
    Standard_Integer: 'int'
  });
  return (name) => {
    if (dict.hasOwnProperty(name)) return dict[name];
    return name;
  };
};
