var conf = require('../conf.js');
conf.Conf.prototype.depends = function(moduleName) {
  console.log("DEpends===========================================", moduleName)
  console.log(this.depends)
  if(this.moduleDepends === undefined)
    this.moduleDepends = [];
  this.moduleDepends.push(moduleName);
}

module.exports.renderSwig = function(decl, parts){
  if(decl.cls !== 'module') return;
  
  return {
      name: 'moduleDepends',
      src: decl.moduleDepends.map(
        (modName) => `%include ../${modName}/module.i`
      ).join('\n')
    };
}