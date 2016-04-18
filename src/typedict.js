const settings = require('./settings.js');
const extend = require('extend');
const builtins = require('./builtinModule.js');

module.exports = function typedict(mods) {
  if (mods === undefined)
    mods = settings.build.modules;

  mods = [builtins()].concat(mods);

  var dict = {};
  mods.forEach((mod) => {
    mod.declarations.forEach((decl) => {
      if (mod.name === 'builtins')
        dict[decl.key] = decl.name;
      else
        dict[decl.key] = `${mod.name}.${decl.name}`;
    });
  });

  mods.filter(mod => mod.typemaps)
    .forEach(mod => mod.typemaps.forEach(tm => {
      dict[tm.from] = dict[tm.to];
    }));

  return (name) => {
    if (dict.hasOwnProperty(name)) return dict[name];
    return name;
  };
};
