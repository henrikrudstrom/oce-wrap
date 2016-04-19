var modules = require('../modules.js')();
var common = require('../common.js');
var settings = require('../settings.js');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

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

function requiredTypesWrapped(member) {
  var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  if (member.cls !== 'constructor')
    unwrapped.push(member.returnType || member.type);
  console.log('unwrapped', unwrapped)
  return unwrapped.some(type => type !== 'void' && !modules.get(type));
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

  var disable = !requiredTypesWrapped(member) ?
    '' : '// arguments or return type not wrapped\n  x';
  // var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  // if (member.cls !== 'constructor')
  //   unwrapped.push(member.returnType || member.type);
  //
  // if (unwrapped.some(type => type !== 'void' && !modules.get(type)))
  //   disable = '// arguments or return type not wrapped\n  x';

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

function expectType(returnType) {
  if (returnType === 'Integer' || returnType === 'Double')
    return ['expect(typeof res).toBe(\'number\');'];
  else if (returnType === 'Boolean')
    return ['expect(typeof res).toBe(\'boolean\');'];
  else if (returnType !== 'void')
    return [
      'expect(typeof res).toBe(\'object\');',
      `expect(res.constructor.name.replace('_exports_', '')).toBe('${returnType}');`
    ];
  return [];
}

function memberReturnType(cls, member, suiteKey) {
  var type = modules.get(member.returnType);
  if (type && type.cls === 'enum') return 'Integer';
  var returnType = member.returnType.indexOf('.') !== -1 ?
    member.returnType.split('.')[1] : member.returnType;
  if (member.downCastToThis)
    returnType = cls.name;


  var override = specOverride.returnType(suiteKey, common.signature(member));
  if (override)
    returnType = override;
  return returnType;
}

function renderMemberFunction(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var obj = create.${cls.parent}.${cls.name}();
    var res = obj.${calldef.name}(${args});`;

  var returnType = memberReturnType(cls, calldef, cls.parent + '.' + cls.name);
  testSrc += expectType(returnType).map(l => '\n    ' + l).join('');
  return renderTest(cls, calldef, testSrc);
}

function renderStaticFunction(cls, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${cls.parent}.${cls.name}.${calldef.name}(${args});`;

  var returnType = memberReturnType(cls, calldef, cls.parent + '.' + cls.name);
  testSrc += expectType(returnType).map(l => '\n    ' + l).join('');
  return renderTest(cls, calldef, testSrc);
}

function renderFreeFunction(mod, calldef) {
  var args = calldef.arguments.map(arg => createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${mod.name}.${calldef.name}(${args});`;
  var sig = common.signature(calldef);
  // TODO: required types not working
  var disable = !requiredTypesWrapped(calldef) ?
    '' : '// arguments or return type not wrapped\n  x';
  var returnType = memberReturnType(mod, calldef, mod.name);
  testSrc += expectType(returnType).map(l => '\n    ' + l).join('');
  var src = `\n
  ${disable}it('${sig}', function(){
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
// TODO: doesnt include static functions...
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
  var sigs = decls.map(common.signature);
  return decls.filter((mem, index) => sigs.indexOf(common.signature(mem)) === index);
}

function renderClassSuite(mod, cls, imports) {
  var declarations = getInheritedDeclarations(cls);

  var constructorTests = declarations
    .filter(decl => decl.cls === 'constructor')
    .map(decl => renderConstructor(cls, decl));
  // var functionTests = [];
  //
  //console.log(mod.name, cls.name, cls.declarations.filter(decl => decl.cls === 'staticfunc').map(decl => decl.name))
  //console.log(mod.name, cls.name, "SDFDSF!", declarations.filter(decl => decl.cls === 'staticfunc').map(decl => decl.name))
  var staticFunctions = cls.declarations
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
    .concat([{ name: decl.name + 'AutoSpec.js', src: renderModuleSuite(decl, imports) }]);
};
