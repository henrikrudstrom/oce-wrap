const extend = require('extend');
const camelCase = require('camel-case');

const features = require('../features.js');
const common = require('../common.js');
const headers = require('../headers.js');

function getMember(cls, memberName) {
  var member = cls.declarations.find(decl => decl.name === memberName);

  if (!member && cls.bases.length > 0) {
    var base = headers.get(cls.bases[0].name);
    return getMember(base, memberName);
  }

  return member || null;
}


function includeAsStatic(expr, template, valueFunc, returnType) {
  var clsName = expr.split('(')[0];
  var cls = headers.get(clsName);

  if (!returnType) {
    if (typeof valueFunc === 'string') {
      returnType = getMember(cls, valueFunc).returnType;
    } else if (typeof valueFunc === 'object') {
      returnType = 'Object';
    } else
      throw new Error('missing argument valueFunc');
  }

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
        origName: cls.name,
        returnType,
        arguments: args,
        depends: cls.name,
        template,
        valueFunc
      };
    });
  res.forEach(decl => this.add(decl));

  return this;
}

function includeGCMake(clsName) {
  return this.includeAsStatic(clsName, 'GCMake', 'Value');
}

function includeBRepBuilder(clsName) {
  return this.includeAsStatic(clsName, 'BRepBuilder', 'Shape');
}

function includeBRepPrim(clsName, valueFunc) {
  valueFunc = valueFunc || 'Solid';
  return this.includeAsStatic(clsName, 'BRepPrim', valueFunc, 'TopoDS_Shape');
}
// function includeBRepAlgo(clsName, valueFunc) {
//   valueFunc = valueFunc || 'Solid';
//   return this.includeAsStatic(clsName, 'BRepPrim', valueFunc, 'TopoDS_Shape');
// }

features.registerConfig(includeAsStatic, includeGCMake, includeBRepBuilder, includeBRepPrim);


var templates = {
  renderGCMake(decl, args, argNames) {
    return `
%extend ${decl.sourceParent} {
  static const ${decl.origReturnType} ${decl.name}(${args}){
    ${decl.origName}* obj = new ${decl.origName}(${argNames});
    return obj->${decl.valueFunc}();
  }
}`;
  },

  renderBRepBuilder(decl, args, argNames) {
    return `
%inline {
  static v8::Handle<v8::Value> ${decl.name}(${args}){
    ${decl.origName}* obj = new ${decl.origName}(${argNames});
    if(!obj->IsDone())
      SWIG_V8_Raise("could not make brep"); // TODO check error
    return upcastTopoDS_Shape(obj->Shape());
  }
}`;
  },

  renderBRepPrim(decl, args, argNames) {
    return `
%inline {
  static v8::Handle<v8::Value> ${decl.name}(${args}){
    ${decl.origName}* obj = new ${decl.origName}(${argNames});
    obj->Build();
    if(!obj->IsDone())
      SWIG_V8_Raise("could not make primitive"); // TODO check error

    return upcastTopoDS_Shape(obj->${decl.valueFunc}());
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
