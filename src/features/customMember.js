const extend = require('extend');
const camelCase = require('camel-case');
const features = require('../features.js');
const headers = require('../headers.js');
const common = require('../common.js');

function staticAsMember(sig) {
  // var name = camelCase(common.removePrefix(method.name));
  var res = headers.get(sig)
    .map(method => {
      var args = method.arguments.map(arg => extend({}, arg));
      return {
        name: method.name,
        key: method.key,
        declType: 'memfun',
        parent: this.name,
        sourceParent: method.parent,
        parentKey: this.key,
        origName: method.name,
        returnType: method.returnType,
        arguments: args,
        depends: method.parent,
        staticAsMember: true
      };
    });
  res.forEach(decl => this.add(decl));

  return this;
}

features.registerConfig(staticAsMember);

function renderJS(decl) {
  if (decl.declType !== 'memfun' || !decl.staticAsMember)
    return false;

  return {
    name: decl.parent + '.js',
    src: `\
  Object.getPrototypeOf(${decl.qualifiedName}.prototype).${decl.name} = function ${decl.name}() {
    return ${decl.getParent().qualifiedName}.${decl.name}.apply(
      this, arguments, Array.prototype.shift.apply(arguments));
  }
    `
  }

}

features.registerRenderer('js', 0, renderJS);
