
const conf = require('../conf.js');
const camelCase = require('camel-case');

function rename(expr, name) {
  var nameFunc = name;
  if (typeof nameFunc !== 'function')
    nameFunc = () => name;
  this.transform(expr, (obj) => {
    if(obj.cls === 'constructor') return;
    obj.rename = true;
    obj.name = nameFunc(obj.name, obj);
    
    //rename parent property of child declarations
    if(!obj.declarations) return;
    obj.declarations.forEach((decl) => {
      decl.parent = obj.name;
      if(decl.cls === 'constructor')
        decl.name = obj.name;
    });
    
  });
  return this;
};

function renameCamelCase(expr){
  return this.rename(expr, camelCase);
}

function removePrefix(expr){
  return this.rename(expr, (name) => {
    var match = name.match(/^((?:Handle_)*)([a-z|A-Z|0-9]+_?)(\w+)$/);
    if(!match) return name;
    return match[1] + match[3];
  });
}

conf.Conf.prototype.rename = rename;
conf.Conf.prototype.camelCase = renameCamelCase;
conf.Conf.prototype.removePrefix = removePrefix;
module.exports.name = 'property'
module.exports.renderSwig = function(decl) {
  //console.log(decl.name, decl.cls)
  if(decl.cls === 'module'){
    return {
        name: 'featureIncludes',
        src: `%include renames.i;`
      };
  }
  if(!decl.rename) return;
  
  if(decl.cls === 'class' || decl.cls === 'enum' || decl.cls === 'typedef')
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${decl.key};`
    }
  else if(decl.cls === 'memfun' || decl.cls === 'variable'){
    var srcDecl = decl.source();
    return {
      name: 'renames.i',
      src: `%rename("${decl.name}") ${srcDecl.parent}::${srcDecl.name};`
    };
  }
};
