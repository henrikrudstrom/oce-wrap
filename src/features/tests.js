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
  return 1; //nextInt.toString();
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
  if (typeName.split('.')[1] === 'int') return int();
  if (typeName.split('.')[1] === 'double') return double();
  if (typeName.split('.')[1] === 'bool') return bool();
  if (typeName.split('.')[1] === 'string') return '';
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
  if (args.indexOf('_') !== -1 || calldef.returnType.indexOf('_') !== -1)
    disable = 'x';

  var returnType = calldef.returnType.indexOf('.') !== -1 ?
    calldef.returnType.split('.')[1] : calldef.returnType;

  var testSrc = `\n
    expect(typeof res).toBe('object');
    expect(obj.constructor.name).toBe('${returnType}');`;
  if (returnType === 'void') {
    testSrc = '';
  }
  if (returnType === 'int' || returnType === 'double')
    testSrc = 'expect(typeof res).toBe(\'number\');';
  if (returnType === 'bool')
    testSrc = 'expect(typeof res).toBe(\'boolean\');';

  var src = `\n
  ${disable}it('${calldef.name}(${calldef.arguments.map(arg => arg.type)})', function(){
    var obj = create.${cls.parent}.${cls.name}();
    var res = obj.${calldef.name}(${args});
${testSrc}
  });`;
  return src;
}

function renderConstructor(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var disable = ''
  if (args.indexOf('_') !== -1)
    disable = 'x';

  var src = `\n
  ${disable}it('${calldef.name}(${calldef.arguments.map(arg => arg.type)})', function(){
    var res = new ${cls.parent}.${calldef.name}(${args});
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('${cls.name}');
  });`;
  return src;
}

function renderClassSuite(cls, imports) {
  var calldefs = cls.declarations
    .filter(decl => decl.cls === 'memfun' || decl.cls === 'constructor');

  var constructorTests = cls.declarations
    .filter(decl => decl.cls === 'constructor')
    .map(decl => renderConstructor(cls, decl));
  // var functionTests = [];
  var functionTests = cls.declarations
    .filter(decl => decl.cls === 'memfun')
    .map(decl => renderCalldef(cls, decl));
  var clsSrc = `\n
${imports}
var create = require('../create.js')
describe('${cls.parent}.${cls.name}', function(){
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
    .map(mod => (`var ${mod} = require('../../../lib/${mod}.node');`))
    .join('\n');
  return decl.declarations
    .filter(d => d.cls === 'class')
    .map(cls =>
      ({ name: `${cls.name}Spec.js`, src: renderClassSuite(cls, imports) })
    );
};
