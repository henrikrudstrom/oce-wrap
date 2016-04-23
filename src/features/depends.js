const features = require('../features.js');
module.exports.name = 'depends';
function depends(moduleName) {
  if (this.moduleDepends === undefined)
    this.moduleDepends = [];
  this.moduleDepends.push(moduleName);
}

features.registerConfig(depends);

module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'module' || decl.moduleDepends === undefined) return false;

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
};
