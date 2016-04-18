var modules = require('../modules.js')();
var settings = require('../settings.js');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

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
  glob.sync(`${settings.paths.definition}/spec/**/*Spec.js`)
    .concat(glob.sync(`${settings.paths.definition}/spec/*Spec.js`))
    .forEach(file => {
      var itexp = / *x?it\('(\w+\(.*\))',((?:.|\n)*?\}\));/g;
      var descExp = /describe\('((?:\w|\.|_| )*)',((?:.|\n)*?}\)(\n| |;)*}\)?)/g;
      var src = fs.readFileSync(file).toString();
      var matches = src.match(descExp);
      if (matches)
        matches.forEach(desc => {
          var suite = desc.match(/describe\('(.+)'/)[1];
          var smatches = desc.match(itexp);
          if (smatches)
            smatches.forEach(it => {
              var name = it.match(/it\('(\w+\(.*\))'/)[1];
              specs[`${suite}#${name}`] = it;
            });
        });
    });
  return specs;
}
var overridenTests = parseTests();

var specOverride = require(
  path.relative(__dirname, `${settings.paths.definition}/spec/notWorking.js`)
);

var nextInt = 0;
var nextDouble = 0.0;
var nextBool = false;

function int() {
  nextInt += 1;
  return 1; // nextInt.toString();
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
  if (typeName === 'Integer') return int();
  if (typeName === 'Double') return double();
  if (typeName === 'Boolean') return bool();
  if (typeName === 'String') return '';
  return `create.${typeName}()`;
}
module.exports.createValue = createValue;

function signature(member) {
  var sig = `${member.name}`;
  if (member.arguments)
    sig += `(${member.arguments.map(arg => arg.type).join(', ')})`;
  return sig;
}


function renderTest(cls, member, testSrc) {
  var sig = `${member.name}`;
  if (member.arguments)
    sig += `(${member.arguments.map(arg => arg.type).join(', ')})`;

  var key = `${cls.parent}.${cls.name}#${sig}`;
  if (overridenTests.hasOwnProperty(key)) {
    return `// ${sig} - Redefined.`;
  }

  // disable tests for members with unwrapped arguments/return type
  var disable = '';
  var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  if (member.cls !== 'constructor')
    unwrapped.push(member.returnType || member.type);
  //console.log("UNWRAPPED", unwrapped)
  if (unwrapped.some(type => type !== 'void' && !modules.get(type)))
    disable = '// arguments or return type not wrapped\n  x';

  if (specOverride.notWorking(cls.parent + '.' + cls.name, sig)) {
    disable = '// TODO: not working\n  x';
  }
  var src = `\n
  ${disable}it('${sig}', function(){
    console.log('${sig}')
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
    var res = obj.${calldef.name}(${args});`;
  if (calldef.downCastToThis)
    returnType = cls.name;
  var override = specOverride.returnType(cls.parent + '.' + cls.name, signature(calldef));
  if (override)
    returnType = override;
  if (returnType === 'Integer' || returnType === 'Double')
    testSrc += '\n    expect(typeof res).toBe(\'number\');';
  else if (returnType === 'Boolean')
    testSrc += '\n    expect(typeof res).toBe(\'boolean\');';
  else if (returnType !== 'void')
    testSrc += `
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${returnType}');`;
  return renderTest(cls, calldef, testSrc);
}
function renderStaticFunction(cls, calldef) {
  var returnType = calldef.returnType.indexOf('.') !== -1 ?
    calldef.returnType.split('.')[1] : calldef.returnType;
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${cls.parent}.${cls.name}.${calldef.name}(${args});`;
  if (calldef.downCastToThis)
    returnType = cls.name;
  var override = specOverride.returnType(cls.parent + '.' + cls.name, signature(calldef));
  if (override)
    returnType = override;
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

function renderFreeFunction(mod, calldef) {
  var returnType = calldef.returnType.indexOf('.') !== -1 ?
    calldef.returnType.split('.')[1] : calldef.returnType;
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${mod.name}.${calldef.name}(${args});`;
  var sig =  signature(calldef);
  var override = specOverride.returnType(mod.name,sig);
  if (override)
    returnType = override;
  if (returnType === 'int' || returnType === 'double')
    testSrc += '\n    expect(typeof res).toBe(\'number\');';
  else if (returnType === 'bool')
    testSrc += '\n    expect(typeof res).toBe(\'boolean\');';
  else if (returnType !== 'void')
    testSrc += `
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${returnType}');`;

  var src = `\n
  it('${sig}', function(){
    console.log('${sig}')
${testSrc}
  });`;
  return src;
}

function renderModuleSuite(mod, imports) {
  var functionTests = mod.declarations
    .filter(decl => decl.cls === 'staticfunc')
    .map(decl => renderFreeFunction(mod, decl));

  var clsSrc = `\
${imports}
var create = require('../create.js')
describe('${mod.name}', function(){
${functionTests.join('\n')}
});
`;
  return clsSrc;
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

function getInheritedDeclarations(cls) {
  var decls = [cls.declarations]
    .concat((cls.bases || []).map(base => {
      var baseCls = modules.get(base.name);
      if (baseCls) {
        return getInheritedDeclarations(baseCls);
      }
      return [];
    }))
    .reduce((a, b) => a.concat(b));
  var sigs = decls.map(signature);
  return decls.filter((mem, index) => sigs.indexOf(signature(mem)) === index);
}

function renderClassSuite(mod, cls, imports) {
  var declarations = getInheritedDeclarations(cls);



  var calldefs = declarations
    .filter(decl => decl.cls === 'memfun' || decl.cls === 'constructor');

  var constructorTests = declarations
    .filter(decl => decl.cls === 'constructor')
    .map(decl => renderConstructor(cls, decl));
  // var functionTests = [];
  var staticFunctions = declarations
    .filter(decl => decl.cls === 'staticfunc')
    .map(decl => renderStaticFunction(cls, decl));
  var functionTests = declarations
    .filter(decl => decl.cls === 'memfun')
    .map(decl => renderMemberFunction(cls, decl));

  var propertyTests = declarations
    .filter(decl => decl.cls === 'property')
    .map(decl => renderProperty(cls, decl));
  var clsSrc = `\
${imports}
var create = require('../create.js')
describe('${cls.parent}.${cls.name}', function(){
${constructorTests.join('\n')}
${staticFunctions.join('\n')}
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
    .map(mod => (`var ${mod} = require('../../lib/${mod}.js');`))
    .join('\n');
  return decl.declarations
    .filter(d => d.cls === 'class')
    .filter(cls => !cls.name.startsWith('Handle_'))
    .filter(cls => !cls.abstract)
    .map(cls =>
      ({ name: `${cls.name}AutoSpec.js`, src: renderClassSuite(decl, cls, imports) })
    )
    //.concat([{name: decl.name+'AutoSpec.js', src: renderModuleSuite(decl, imports)}])
};
