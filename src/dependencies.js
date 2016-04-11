const settings = require('./settings.js');
const modules = require('./modules.js')();


function unique(t, index, array) {
  return array.indexOf(t) === index;
}

function modName(name) {
  var matchRes = name.match(/(?:Handle_)*(\w+?)_\w+/);
  if (!matchRes) return name;
  return matchRes[1];
}


function dependencyReader(mods) {
  var cache = {};

  // return the type names that class member depends on
  function memberDepends(mem) {
    return [mem.returnType]
      .concat(mem.arguments ? mem.arguments.map((a) => a.type) : [])
      .filter((t, index, array) => array.indexOf(t) === index);
  }

  // return the type names that this class depends on
  function classDepends(cls, recursive, constructorsOnly, visited) {
    var firstCall = false;
    if (visited === undefined) {
      firstCall = true;
      visited = {};
    }

    if (cache.hasOwnProperty(cls.name)) {
      return cache[cls.name];
    }
    if (visited.hasOwnProperty(cls.name)) {
      return [];
    }
    visited[cls.name] = true;
    var res = cls.declarations
      .filter((mem) => !constructorsOnly || mem.cls === 'constructor')
      .map(memberDepends)
      .reduce((a, b) => a.concat(b), [])
      .filter(unique)
      .filter((name) => name && name !== 'void');

    if (recursive) {
      res = res.concat(
        res.map((name) => mods.get(name))
        .filter((c) => c !== null)
        .map((c) => classDepends(c, recursive, constructorsOnly, visited))
        .reduce((a, b) => a.concat(b), [])
      ).filter(unique);
    }

    if (firstCall) {
      var qualifiedName = cls.name;
      if (cls.parent)
        qualifiedName = cls.parent + '.' + cls.name;
      return res.filter((name) => name !== qualifiedName);
    }
    cache[cls.name] = res;
    return res;
  }

  function moduleDepends(mod) {
    return mod.declarations
      .map((d) => classDepends(d, false))
      .reduce((a, b) => a.concat(b), [])
      .concat(mod.declarations.map(d => d.name))
      .filter((d, index, array) => array.indexOf(d) === index);
  }

  function toolkitDepends(mod) {
    var classes = moduleDepends(mod)
          .map(cls => modules.get(cls))
      .filter(cls => cls !== null)
      .map(cls => cls.key)
    var modDeps = moduleDepends(mod)
      .map(cls => modules.get(cls))
      .filter(cls => cls !== null)
      .map(cls => modName(cls.key))
      .concat('Standard') // TODO: temp fix
      .filter((cls, index, array) => array.indexOf(cls) === index);
    console.log(modDeps, "cls", classes)
    return settings.oce.toolkits
      .filter(tk => tk.modules.some(
        m1 => modDeps.some((m2) => m1 === m2)
      )).map(tk => tk.name);
  }

  return {
    classDepends,
    moduleDepends,
    toolkitDepends
  };
}
module.exports = dependencyReader;
module.exports.modName = modName;
