const settings = require('./settings.js');


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
    var res = []
      .concat(mem.declType === 'constructor' ? [] : [mem.returnType || mem.type])
      .concat(mem.depends || [])
      .concat(mem.arguments ? mem.arguments.map((a) => a.type) : [])
      .filter((t, index, array) => array.indexOf(t) === index);

    return res;
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
      if(cls.declType === 'enum' || cls.declType === 'typedef')
        return [];
      return memberDepends(cls);
    }
    
    var res = cls.declarations
      .filter((mem) => !options.constructorsOnly || mem.declType === 'constructor')
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
        // TODO: source occ class names are qualified by default
        qualifiedName = cls.parent + separator + cls.name;
      return res.filter((name) => name !== qualifiedName);
    }
    
    // cache result
    cache[cls.name] = res;
    
    return res;
  }

  function toolkitDepends(mod) {
    // get dependant modules
    var deps = mod.declarations
      .map(d => classDepends(d, false))
      .map(d => {if(d === undefined) { throw new Error()} return d})
      .concat(mod.declarations.map(cls =>  cls.origName))
      .reduce((a, b) => a.concat(b), [])
      .map(cls => modName(cls))
      .filter((d, index, array) => array.indexOf(d) === index);
    
    // map to unique toolkit binaries
    return settings.oce.toolkits
      .filter(tk => tk.modules.some(
        m1 => deps.some((m2) => m1 === m2)
      )).map(tk => tk.name);
  }

  return {
    classDepends,
    toolkitDepends
  };
}

module.exports = dependencyReader;

