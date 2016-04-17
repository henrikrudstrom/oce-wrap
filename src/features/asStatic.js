const extend = require('extend');
const conf = require('../conf.js');
const headers = require('../headers.js');


module.exports.name = 'asStatic';
conf.Conf.prototype.includeGCMake = function(clsName) {
  var cls = headers.get(clsName);
  var returnType = cls.get('Value').returnType;
  var name = cls.name.replace('GC_Make', '');
  var res = cls.declarations
    .filter(decl => decl.cls === 'constructor')
    .map(cons => {
      var args = extend({}, cons.arguments);
      return {
        name,
        key: cons.key,
        cls: 'staticfunc',
        parent: this.name,
        originCls: cls.name,
        returnType,
        arguments: args
      };
    });
  this.declarations = this.declarations.concat(res);
  return this;
};

module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'staticfunc') return false;

  var source = decl.source();
  var args = source.arguments.map(arg => arg.decl).join(', ');
  var argNames = source.arguments.map(arg => arg.name).join(', ');

  var src = `%extend ${source.parent} {
  const static ${source.returnType} ${decl.name}(${args}){
    ${source.parent}* obj = new ${source.parent}(${argNames});
    ${source.returnType} res;
    obj->${source.name}(t, res);
    return res;
  }
}`;

  return { name: 'extends.i', src };
};




function renderMakeFunctions(decl) {
  var source = decl.source()
  var argDecls = source.arguments.map(arg => arg.decl + ' ' + arg.name);
  var args = source.arguments.map(arg => arg.name);
  src = `const ${decl.returnFunc.source().returnType} ${decl.name}(${argDecls}) {
    ${source.parent}* obj = new ${source.parent}(${args});
    return obj->${returnMethod}();
  }`

}
