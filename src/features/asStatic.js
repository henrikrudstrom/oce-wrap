module.exports.name = 'asStatic'
const conf = require('../conf.js');
const headers = require('../headers.js');
conf.Conf.prototype.property = function(decl, clsName, method, newName) {
  this.transform(getter, (getMethod) => {
    if (decl.cls === 'constructor') return false;
    var cls = headers.get(clsName);
    var method = cls.declarations.find(decl => decl.name === method);
    
    var func = {
      name: newName,
      key: cls.name + '::' + method.name,
      cls: 'staticfund',
      parent: this.name,
      originCls: cls.name,
      returnType: method.returnType,
      arguments: extend(method.arguments)
    };

    this.declarations.push(func);

    return property;
  });
  return this;
};
module.exports.renderSwig = function(decl) {
  if(!decl.includeAsStatic) return;
  
  var source = decl.source()
  var src = `%extend ${source.parent} {
  const ${source.returnType} ${decl.name}(const gp_Quaternion &b, Standard_Real t){
    ${source.parent}* obj = new ${source.parent}(*$self, b);
    ${source.returnType} res;
    obj->${source.name}(t, res);
    return res;
  }
}`
  
  return {
    name: 'properties.i',
    src: `%attribute(${args.join(', ')});`
  };
};




function renderMakeFunctions(decl){
  var source = decl.source()
  var argDecls = source.arguments.map(arg => arg.decl + ' ' + arg.name);
  var args = source.arguments.map(arg => arg.name);
  src = `const ${decl.returnFunc.source().returnType} ${decl.name}(${argDecls}) {
    ${source.parent}* obj = new ${source.parent}(${args});
    return obj->${returnMethod}();
  }` 
  
}