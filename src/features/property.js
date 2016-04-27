const features = require('../features.js');
const common = require('../common.js');
const testLib = require('../testLib.js');

function property(getter, setter, name) {
  this.pushQuery(4, getter, (getMethod) => {
    if (getMethod.cls === 'constructor') return false;
    if (typeof setter === 'string') {
      var setterStr = setter;
      setter = () => setterStr;
    }
    var setMethod = this.get(setter());
    var propertyDecl = {
      name: name || getMethod.name.replace(/^Get/, ''),
      key: getMethod.key,
      cls: 'property',
      type: getMethod.returnType,
      originalType: getMethod.returnType,
      typeDecl: getMethod.returnTypeDecl,
      getter: getMethod.name,
      getterKey: getMethod.key,
      setter: setMethod ? setMethod.name : undefined,
      setterKey: setMethod ? setMethod.key : undefined,
      getterSignature: common.signature(getMethod, true),
      setterSignature: common.signature(setMethod, true),
      parent: this.name, 
      originalParent: this.name
    };
    this.exclude(getMethod.key);
    if (setMethod) this.exclude(setMethod.key);
    this.declarations.push(propertyDecl);

    return propertyDecl;
  });
  return this;
}

features.registerConfig(property);


function renderProperty(decl) {
  if (decl.cls !== 'property') return false;

  var args = [decl.originalParent, decl.originalType, decl.name, decl.getterSignature];
  if (decl.setterKey) {
    args.push(decl.setterSignature);
  }

  return {
    name: 'properties.i',
    src: `%attribute(${args.join(', ')});`
  };
}

features.registerRenderer('swig', 0, renderProperty);

function renderPropertyTest(prop, parts) {
  if (prop.cls !== 'property')
    return false;

  var cls = prop.getParent();

  var value = testLib.createValue(prop.type);
  var src = `\
    var obj = create.${cls.parent}.${cls.name}();
    obj.${prop.name} = ${value};
    var res = obj.${prop.name};
    expect(obj.${prop.name}).toBe(${value});`;
  return {
    name: cls.name + 'MemberSpecs',
    src: testLib.renderTest(prop, src, parts)
  };
}

features.registerRenderer('spec', 0, renderPropertyTest);
