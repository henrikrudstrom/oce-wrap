const features = require('../features.js');
const common = require('../common.js');
const camelCase = require('camel-case');

function rename(expr, name) {
  var nameFunc = name;
  if (typeof nameFunc !== 'function')
    nameFunc = () => name;

  this.pushToStack(5, expr, (obj) => {
    if (obj.cls === 'constructor') return;

    obj.rename = true;
    obj.name = nameFunc(obj.name, obj);

    // rename parent property of child declarations
    // TODO: handle this in configure.js
    if (!obj.declarations) return;
    obj.declarations.forEach((decl) => {
      decl.parent = obj.name;
      if (decl.cls === 'constructor')
        decl.name = obj.name;
    });
  });
  return this;
}

function renameCamelCase(expr) {
  return this.rename(expr, camelCase);
}

function removePrefix(expr) {
  return this.rename(expr,
    name => common.removePrefix(name)
  );
}

features.registerConfig(rename, renameCamelCase, removePrefix);

function renderRename(decl) {
  if (decl.cls === 'module') {
    return {
      name: 'featureIncludes',
      src: '%include "renames.i";'
    };
  }
  if (!decl.rename) return false;

  if (decl.cls === 'class' || decl.cls === 'enum' || decl.cls === 'typedef')
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${decl.key};`
    };
  else if (decl.cls === 'memfun' || decl.cls === 'variable') {
    var srcDecl = decl.source();
    var args = srcDecl.arguments.map(arg => arg.decl).join(', ');
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${srcDecl.parent}::${srcDecl.name}(${args});`
    };
  }
  return false;
}

features.registerRenderer('swig', 0, renderRename);
