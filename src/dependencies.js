const settings = require('./settings.js');
const loadModules = require('./modules.js');


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
  function memberDepends(mem, source) {
    if (source)
      mem = mem.source();
    return [mem.returnType]
      .concat(mem.depends || [])
      .concat(mem.arguments ? mem.arguments.map((a) => a.type) : [])
      .filter((t, index, array) => array.indexOf(t) === index);
  }

  // return the type names that this class depends on
  function classDepends(cls, options, visited) {
    options = options || {};
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

    if (!cls.declarations) {
      return memberDepends(cls);
    }
    var res = cls.declarations
      .filter((mem) => !options.constructorsOnly || mem.cls === 'constructor')
      .map(mem => memberDepends(mem, options.source))
      .reduce((a, b) => a.concat(b), [])
      .filter(unique)
      .filter((name) => name && name !== 'void');

    if (options.recursive) {
      res = res.concat(
        res.map((name) => mods.get(name))
        .filter((c) => c !== null)
        .map((c) => classDepends(c, options, visited))
        .reduce((a, b) => a.concat(b), [])
      ).filter(unique);
    }

    // dont include this class in dependency list
    if (firstCall) {
      var qualifiedName = cls.name;
      var separator = options.source ? '_' : '.';
      if (cls.parent)
        qualifiedName = cls.parent + separator + cls.name;
      return res.filter((name) => name !== qualifiedName);
    }
    //cache result
    cache[cls.name] = res;
    return res;
  }

  function toolkitDepends(mod) {
    var deps = mod.declarations
      .map((d) => classDepends(d, false))
      .concat(mod.declarations.map(cls => cls.source().name))
      .reduce((a, b) => a.concat(b), [])
      .map(cls => modName(cls))
      .filter((d, index, array) => array.indexOf(d) === index);
    return settings.oce.toolkits
      .filter(tk => tk.modules.some(
        m1 => deps.some((m2) => m1 === m2)
      )).map(tk => tk.name);
  }

  return {
    classDepends,
    //moduleDepends,
    toolkitDepends
  };
}
module.exports = dependencyReader;
module.exports.modName = modName;
