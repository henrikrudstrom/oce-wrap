var modules = require('../modules.js')();
const glob = require('glob');
const fs = require('fs');
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

function parseTests() {
  var specs = {};
  glob.sync('src/spec/**/*Spec.js').forEach(file => {
    var itexp = / *x?it\('(\w+\(.*\))',((?:.|\n)*?\}\));/g;
    var descExp = /describe\('(?:\w|\.|_)*',((?:.|\n)*?)(?=describe)/g;
    var src = fs.readFileSync(file).toString();

    src.match(descExp).forEach(desc => {
      var suite = desc.match(/describe\('(.+)'/)[1];
      desc.match(itexp).forEach(it => {
        var name = it.match(/it\('(\w+\(.*\))'/)[1];
        specs[`${suite}#${name}`] = it;
      });
    });
  });
  return specs;
}
var overridenTests = parseTests();


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

function renderTest(cls, member, testSrc) {
  var signature = `${member.name}`;
  if(member.arguments)
    signature += `(${member.arguments.map(arg => arg.type).join(', ')})`;

  var key = `${cls.parent}.${cls.name}#${signature}`;
  if (overridenTests.hasOwnProperty(key))
    return overridenTests[key];

  // disable tests for members with unwrapped arguments/return type
  var disable = ''
  var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  if(member.cls !== 'constructor')
    unwrapped.push(member.returnType || member.type)

  //signature.concat(member.returnType || member.type).indexOf('_') !== -1
  console.log(unwrapped)
  if (unwrapped.some(type => type !== 'void' && !modules.get(type)))
    disable = 'x';

  console.log(unwrapped, disable)

  var src = `\n
  ${disable}it('${signature}', function(){
    console.log('${signature}');
${testSrc}
  });`;
  return src;
}

function renderMemberFunction(cls, calldef) {
  var returnType = calldef.returnType.indexOf('.') !== -1 ?
    calldef.returnType.split('.')[1] : calldef.returnType;
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var obj = create.${cls.parent}.${cls.name}();
    var obj_h = obj._handle;
    var res = obj.${calldef.name}(${args});
    if(res)
       var res_h = res._handle;`

  if (returnType === 'int' || returnType === 'double')
    testSrc += '\n    expect(typeof res).toBe(\'number\');';
  else if (returnType === 'bool')
    testSrc += '\n    expect(typeof res).toBe(\'boolean\');';
  else if (returnType !== 'void')
    testSrc += `
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${returnType}');`;
  return renderTest(cls, calldef, testSrc);
}


function renderConstructor(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');

  var src = `\
    var res = new ${cls.parent}.${calldef.name}(${args});
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${cls.name}');`;
  return renderTest(cls, calldef, src);
}


function renderProperty(cls, prop) {
  var value = createValue(prop.type);
  var src = `\
    var obj = create.${cls.parent}.${cls.name}();
    var val = ${value};
    obj.${prop.name} = val;
    expect(obj.${prop.name}).toBe(val);`;
  return renderTest(cls, prop, src);
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
    .map(decl => renderMemberFunction(cls, decl));

  var propertyTests = cls.declarations
    .filter(decl => decl.cls === 'property')
    .map(decl => renderProperty(cls, decl));
  var clsSrc = `\n
${imports}
var create = require('../create.js')
describe('${cls.parent}.${cls.name}', function(){
${constructorTests.join('\n')}
${functionTests.join('\n')}
${propertyTests.join('\n')}
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
    .filter(cls => !cls.name.startsWith('Handle_'))
    //.filter(cls => !cls.abstract)
    .map(cls =>
      ({ name: `${cls.name}Spec.js`, src: renderClassSuite(cls, imports) })
    );
};
