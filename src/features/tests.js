var modules = require('../modules.js')();

module.exports.renderTest = function(cls, parts) {

};

function validType(typeName) {
  if (typeName === 'int') return true;
  if (typeName === 'double') return true;
  if (typeName === 'bool') return true;
  return modules.get(typeName) !== null;
}

function findConstructor(type) {

  console.log(type.name)
  var constructors = type.declarations
    .filter(decl => decl.cls === 'constructor')
    .filter(decl => decl.arguments.every(arg => validType(arg.type)));
  var withArgs = constructors.filter(decl => decl.arguments.length > 0);

  if (withArgs.length < 1)
    return constructors[0];
  return withArgs[0];
}

var nextInt = 0;
var nextDouble = 0.0;
var nextBool = false;

function int() {
  nextInt += 1;
  return nextInt.toString();
}

function double() {
  nextDouble += 0.5;
  return nextDouble.toString();
}

function bool() {
  nextBool = !nextBool;
  return nextBool.toString();
}

function createValue(typeName) {
  if (typeName === 'int') return int();
  if (typeName === 'double') return double();
  if (typeName === 'bool') return bool();
  return `create.${typeName}()`;
}
module.exports.createValue = createValue;

// function initArg(arg) {
//   var decl = modules.find(arg).
//
//
// }

function renderCalldef(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var disable = ''
  if (args.indexOf('_') !== -1)
    disable = 'x';
  var src = `\n
  ${disable}it('${calldef.name}', function(){
    var obj = create.${cls.parent}.${cls.name}();
    var res = obj.${calldef.name}(${args});
    expect(typeof obj).toBe('object');
    expect(obj.constructor.name).toBe('${calldef.returnType}');
  });`;
  return src;
}

function renderConstructor(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var disable = ''
  if (args.indexOf('_') !== -1)
    disable = 'x';
  var src = `\n
  ${disable}it('${calldef.name}', function(){
    var res = new ${cls.parent}.${calldef.name}(${args});
    expect(typeof obj).toBe('object');
    expect(obj.constructor.name).toBe('${calldef.returnType}');
  });`;
  return src;
}

function renderClassSuite(cls, imports) {
  var calldefs = cls.declarations
    .filter(decl => decl.cls === 'memfun' || decl.cls === 'constructor');

  var constructorTests = cls.declarations
    .filter(decl => decl.cls === 'constructor')
    .map(decl => renderConstructor(cls, decl));

  var functionTests = cls.declarations
    .filter(decl => decl.cls === 'memfun')
    .map(decl => renderCalldef(cls, decl));
  var clsSrc = `\n
${imports}
var create = require('../create.js')
describe('${cls.name}', function(){
${constructorTests.join('\n')}
${functionTests.join('\n')}
});
`;
  return clsSrc;
}
module.exports.renderClassSuite = renderClassSuite;

module.exports.renderTest = function(decl, parts) {
  if (decl.cls !== 'module') return false;
  var imports = [decl.name].concat(decl.moduleDepends || [])
    .map(mod => (`var ${mod} = require('../../lib/${mod}.js');`))
    .join('\n');
  return decl.declarations
    .filter(d => d.cls === 'class')
    .map(cls =>
      ({ name: `${cls.name}.js`, src: renderClassSuite(cls, imports) })
    );
};
