module.exports.name = 'property';
const conf = require('../conf.js');
const common = require('../common.js');
module.exports.name = 'property';
conf.Conf.prototype.property = function(getter, setter, name) {
  this.transform(getter, (getMethod) => {
    if (getMethod.cls === 'constructor') return false;
    if (typeof setter === 'string') {
      var setterStr = setter;
      setter = () => setterStr;
    }
    var setMethod = this.get(setter());

    var property = {
      name: name || getMethod.name.replace(/^Get/, ''),
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
    if (setMethod) this.exclude(setMethod.key);
    this.declarations.push(property);

    return property;
  });
  return this;
};

conf.MultiConf.prototype.property = function property(getter, setter) {
  this.map((decl) => decl.property(getter, setter));
  return this;
};


module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'property') return false;
  var srcGetter = decl.source('getterKey');

  var args = [srcGetter.parent, srcGetter.returnType, decl.name, common.signature(srcGetter, true)];
  if (decl.setterKey) {
    var srcSetter = decl.source('setterKey');
    args.push(common.signature(srcSetter, true));
  }
  return {
    name: 'properties.i',
    src: `%attribute(${args.join(', ')});`
  };
};
