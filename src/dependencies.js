//const settings = require('./settings.js');

function unique(t, index, array) {
  return array.indexOf(t) === index
}


function modName(name) {
  var matchRes = name.match(/(?:Handle_)*(\w+?)_\w+/);
  if (!matchRes) return name;
  return matchRes[1];
}

function dependencyReader(mods) {
  var visited = {};
  var cache = {};
  // return the type names that class member depends on
  function memberDepends(mem) {
    return [mem.returnType]
      .concat(mem.arguments.map((a) => a.type))
      .filter((t, index, array) => array.indexOf(t) === index);
  }

  // return the type names that this class depends on
  function classDepends(cls, recursive, constructorsOnly, visited) {
    var firstCall = false;
    if (visited === undefined) {
      firstCall = true;
      visited = {};
    }
    //console.log("dep" , cls.name)
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
  return classDepends;
}
module.exports = dependencyReader;
