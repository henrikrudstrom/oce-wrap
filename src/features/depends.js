const features = require('../features.js');

function depends(moduleName) {
  if (this.moduleDepends === undefined)
    this.moduleDepends = [];
  this.moduleDepends.push(moduleName);
}

features.registerConfig(depends);


function renderDependencies(decl) {
  if (decl.declType !== 'module' || decl.moduleDepends === undefined) return false;

  return [{
    name: 'moduleDepends',
    src: decl.moduleDepends.map(
      (modName) => `%import "../${modName}/module.i"`
    ).join('\n')
  },
  {
    name: 'moduleIncludes',
    src: decl.moduleDepends.map(
      (modName) => `%include "../${modName}/headers.i"`
    ).join('\n')
  }];
}

features.registerRenderer('swig', 0, renderDependencies);
