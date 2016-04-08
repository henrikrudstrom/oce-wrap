module.exports.name = 'property'
const conf = require('../conf.js');
const headers = require('../headers.js');
conf.Conf.prototype.property = function(getter, setter, name) {
  this.transform(getter, (getMethod) => {
    if(getMethod.cls === 'constructor') return;
    
    if(typeof setter === 'string'){
      var setterStr = setter;
      setter = () => setterStr;
    }
    var setMethod = this.get(setter(getter));
    
    var property = {
      name: name || getMethod.name.replace(/^Get/, ""),
      key: getMethod.key,
      cls: 'property',
      type: getMethod.returnType,
      typeDecl: getMethod.returnTypeDecl,
      getter: getMethod.name,
      getterKey: getMethod.key,
      setter: setMethod ? setMethod.name : undefined,
      setterKey: setMethod ? setMethod.key : undefined
    };
    
    this.exclude(getMethod.key);
    this.exclude(setMethod.key);
    this.declarations.push(property);
    
    return property;
  });
  return this;
};
module.exports.renderSwig = function(decl) {
  if(decl.cls !== 'property') return;
  var srcGetter = decl.source('getterKey')
  var args = [srcGetter.parent, srcGetter.returnType, decl.name, decl.getterKey]
  if(decl.setterKey)
    args.push(decl.setterKey)
  
  return {
    name: decl.parent + 'Properties',
    src: `%attribute(${args.join(', ')});`
  };
};
