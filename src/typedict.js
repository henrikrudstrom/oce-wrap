const settings = require('./settings.js');
const builtins = require('./builtinModule.js');
const features = require('./features');


module.exports = function typedict(mods) {
  if (mods === undefined)
    mods = settings.build.modules;

  mods = [builtins()].concat(mods);

  var dict = {};

  // process renames
  mods.forEach((mod) => {
    mod.declarations.forEach((decl) => {
      if (mod.name === 'builtins')
        dict[decl.key] = decl.name;
      else
        dict[decl.key] = `${mod.name}.${decl.name}`;
    });
  });
  //
  // process typemaps
  mods.concat(mods.map(mod => mod.declarations))
    .filter(mod => mod.typemaps)
    .forEach(mod => mod.typemaps.forEach(tm => {
      dict[tm.native] = dict.hasOwnProperty(tm.wrapped) ? dict[tm.wrapped] : tm.wrapped;
    }));

  function getName(name) {
    // var n = name.indexOf('.') !== -1 ? name.split('.')[0] : name;
    // var typemap = features.getTypemap(n);
    // if (typemap) {
    //   return getName(typemap.wrapped);
    // }
    if (dict.hasOwnProperty(name)) return dict[name];
    return name;
  }
  return getName;
};
