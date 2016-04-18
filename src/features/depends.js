var conf = require('../conf.js');
conf.Conf.prototype.depends = function(moduleName) {
  if (this.moduleDepends === undefined)
    this.moduleDepends = [];
  this.moduleDepends.push(moduleName);
};

module.exports.renderSwig = function(decl, parts) {
  if (decl.cls !== 'module' || decl.moduleDepends === undefined) return false;

  return [ {
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
