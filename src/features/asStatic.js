const extend = require('extend');
const camelCase = require('camel-case');
const features = require('../features.js');
const common = require('../common.js');
const headers = require('../headers.js');


module.exports.name = 'asStatic';

function includeAsStatic(expr, template, valueFunc) {
  var clsName = expr.split('(')[0];
  var cls = headers.get(clsName);
  var returnType = cls.declarations.find(decl => decl.name === valueFunc).returnType;

  var name = camelCase(common.removePrefix(cls.name));
  var res = cls.declarations
    .filter(decl => decl.cls === 'constructor')
    .filter(decl => !decl.copyConstructor)
    .filter(decl => common.match(expr, decl.key))
    .map(cons => {
      var args = cons.arguments.map(arg => extend({}, arg));
      return {
        name,
        key: cons.key,
        cls: 'staticfunc',
        parent: this.name,
        sourceParent: this.name,
        parentKey: cls.name,
        originCls: cls.name,
        returnType,
        sourceReturnType: returnType,
        arguments: args,
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
  renderGCMake(decl, source, args, argNames) {
    return `%extend ${decl.sourceParent} {
  static const ${decl.sourceReturnType} ${decl.name}(${args}){
    ${source.parent}* obj = new ${source.parent}(${argNames});
    return obj->${decl.valueFunc}();
  }
}`;
  },
  renderBRepBuilder(decl, source, args, argNames) {
    return `%inline {
  static const ${decl.sourceReturnType} ${decl.name}(${args}){
    ${source.parent}* obj = new ${source.parent}(${argNames});
    if(!obj->IsDone())
      SWIG_V8_Raise("could not make edge"); // TODO check error
    return obj->${decl.valueFunc}();
  }
}`;
  }
};

module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'staticfunc') return false;
  var source = decl.source();
  var args = source.arguments.map(arg => arg.decl + ' ' + arg.name).join(', ');
  var argNames = source.arguments.map(arg => arg.name).join(', ');
  var src = templates['render' + decl.template](decl, source, args, argNames);
  return { name: 'extends', src };
};
