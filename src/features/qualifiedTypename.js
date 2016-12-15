const fs = require('fs');
const path = require('path');
const settings = require('../settings.js');
const features = require('../features');

function statement(mod, decl) {
  var qName = `${mod.name}.${decl.name}`;
  return `\
Object.getPrototypeOf(${qName}.prototype)
  .qualifiedName = '${qName}';`;
}
function renderQualifiedNames(mod, parts) {
  if (mod.declType !== 'module')
    return false;

  return {
    name: mod.name + 'qualifiedNames',
    src: mod.declarations
      .filter(decl => decl.declType === 'class')
      .map(decl => statement(mod, decl))
      .join('\n')
  };
}
features.registerRenderer('js', 10, renderQualifiedNames);
