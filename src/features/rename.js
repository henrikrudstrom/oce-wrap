const features = require('../features.js');
const common = require('../common.js');
const camelCase = require('camel-case');


function rename(expr, name) {
  var nameFunc = name;
  if (typeof nameFunc !== 'function')
    nameFunc = () => name;

  this.pushQuery(5, expr, (obj) => {
    if (obj.declType === 'constructor') return;

    obj.rename = true;
    obj.name = nameFunc(obj.name, obj);

    // rename parent property of child declarations
    // TODO: handle this in configure.js
    if (!obj.declarations) return;
    obj.declarations.forEach((decl) => {
      decl.parent = obj.name;
      if (decl.declType === 'constructor')
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
  if (decl.declType === 'module') {
    return {
      name: 'featureIncludes',
      src: '%include "renames.i";'
    };
  }
  if (!decl.rename) return false;

  if (decl.declType === 'class' || decl.declType === 'enum' || decl.declType === 'typedef')
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${decl.key};`
    };
  else if (decl.declType === 'memfun' || decl.declType === 'variable') {
    var args = decl.origArguments.map(arg => arg.decl).join(', ');
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${decl.getParent().origName}::${decl.origName}(${args});`
    };
  }
  return false;
}

features.registerRenderer('swig', 50, renderRename);
