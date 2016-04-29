const extend = require('extend');
const camelCase = require('camel-case');

const features = require('../features.js');
const common = require('../common.js');
const headers = require('../headers.js');

function includeAsStatic(expr, template, valueFunc) {
  var clsName = expr.split('(')[0];
  var cls = headers.get(clsName);
  var returnType = cls.declarations.find(decl => decl.name === valueFunc).returnType;
  //console.log(cls.name, cls.declarations)
  var name = camelCase(common.removePrefix(cls.name));
  var res = cls.declarations
    .filter(decl => decl.declType === 'constructor')
    .filter(decl => !decl.copyConstructor)
    .filter(decl => common.match(expr, decl.key))
    .map(cons => {
      var args = cons.arguments.map(arg => extend({}, arg));
      return {
        name,
        key: cons.key,
        declType: 'staticfunc',
        parent: this.name,
        sourceParent: this.name,
        parentKey: cls.name,
        originDeclType: cls.name,
        origName: cls.name,
        returnType,
        sourceReturnType: returnType,
        arguments: args,
        origArguments: args,
        depends: cls.name,
        template,
        valueFunc
      };
    });
  this.declarations = this.declarations.concat(res);
  return this;
}

function includeGCMake(clsName) {
  return this.includeAsStatic(clsName, 'GCMake', 'Value');
}

function includeBRepBuilder(clsName, valueFunc) {
  return this.includeAsStatic(clsName, 'BRepBuilder', valueFunc);
}

features.registerConfig(includeAsStatic, includeGCMake, includeBRepBuilder);


var templates = {
  renderGCMake(decl, args, argNames) {
    return `%extend ${decl.sourceParent} {
  static const ${decl.sourceReturnType} ${decl.name}(${args}){
    ${decl.origName}* obj = new ${decl.origName}(${argNames});
    return obj->${decl.valueFunc}();
  }
}`;
  },
  renderBRepBuilder(decl, args, argNames) {
    return `%inline {
  static const ${decl.sourceReturnType} ${decl.name}(${args}){
    ${decl.origName}* obj = new ${decl.origName}(${argNames});
    if(!obj->IsDone())
      SWIG_V8_Raise("could not make edge"); // TODO check error
    return obj->${decl.valueFunc}();
  }
}`;
  }
};

function renderAsStatic(decl) {
  if (decl.declType !== 'staticfunc') return false;
  
  var args = decl.arguments.map(arg => arg.decl + ' ' + arg.name).join(', ');
  var argNames = decl.arguments.map(arg => arg.name).join(', ');
  
  var src = templates['render' + decl.template](decl, args, argNames);
  return { name: 'extends', src };
}

features.registerRenderer('swig', 0, renderAsStatic);
