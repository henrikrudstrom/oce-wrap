const features = require('../features.js');
const testLib = require('../testLib.js');

//
// swig rendering
//

function renderArg(arg, index, indexes) {
  var res = arg.decl + ' ' + arg.name;
 
  if (indexes.indexOf(index) !== -1) {
    res += '_out';
  }

  if (arg.default) {
    res += '=' + arg.default;
  }
  return res;
}

function renderMemberFunction(decl) {
  if (decl.cls !== 'constructor' && decl.cls !== 'memfun' || decl.custom)
    return false;
  
  var indexes = decl.argouts ? decl.argouts.map(argout => argout.index) : [];
  var source = decl.source();

  var args = source.arguments.map((arg, index) => renderArg(arg, index, indexes))
    .join(', ');
  
  var stat = decl.static ? 'static ' : '';
  var cons = decl.const ? 'const ' : '';

  return {
    name: decl.parent + 'MemberFunctions',
    src: `
    %feature("compactdefaultargs") ${source.name};
    ${stat}${cons}${source.returnType + ' '}${source.name}(${args});`
  };
}

features.registerRenderer('swig', 40, renderMemberFunction);

//
// test rendering
//

function argValues(args) {
  return args.map(arg => testLib.createValue(arg.type)).join(', ');
}

function renderMemberFunctionTest(calldef, parts) {
  if (calldef.cls !== 'memfun')
    return false;

  var cls = calldef.getParent();
  var args = argValues(calldef.arguments);
  var testSrc = `\
    var obj = create.${cls.parent}.${cls.name}();
    var res = obj.${calldef.name}(${args});`;

  return {
    name: cls.name + 'MemberSpecs',
    src: testLib.renderTest(calldef, testSrc, parts)
  };
}

function renderConstructorTest(calldef, parts) {
  if (calldef.cls !== 'constructor')
    return false;

  var cls = calldef.getParent();
  var args = argValues(calldef.arguments);

  var src = `\
    var res = new ${cls.parent}.${calldef.name}(${args});`;

  return {
    name: cls.name + 'MemberSpecs',
    src: testLib.renderTest(calldef, src, parts)
  };
}

function renderStaticFunctionTest(calldef, parts) {
  if (calldef.cls !== 'staticfunc' || calldef.getParent().cls !== 'class')
    return false;

  var cls = calldef.getParent();
  var args = argValues(calldef.arguments);

  var testSrc = `\
    var res = ${cls.parent}.${cls.name}.${calldef.name}(${args});`;

  return {
    name: cls.name + 'MemberSpecs',
    src: testLib.renderTest(calldef, testSrc, parts)
  };
}

function renderFreeFunctionTest(calldef, parts) {
  if (calldef.cls !== 'staticfunc' || calldef.getParent().cls !== 'module')
    return false;

  var mod = calldef.getParent();
  var args = argValues(calldef.arguments);

  var testSrc = `\
    var res = ${mod.name}.${calldef.name}(${args});`;
  return {
    name: mod.name + 'ModuleSpecs',
    src: testLib.renderTest(calldef, testSrc, parts)
  };
}

function renderTypeExpectations(decl) {
  if (decl.cls !== 'module')
    return false;
  
  return {
    name: 'testHelpers.js',
    src: `\
module.exports.expectType = function(res, type){
  if (type === 'Integer' || type === 'Double')
    return expect(typeof res).toBe('number');
  
  if (type === 'Boolean')
    return expect(typeof res).toBe('boolean');
  
  if(type.indexOf('.') !== -1)
    type = type.split('.')[1];
  
  expect(typeof res).toBe('object');
  expect(res.constructor.name.replace('_exports_', '')).toBe(type);
}
`
  };
}

features.registerRenderer('spec', 50, renderMemberFunctionTest);
features.registerRenderer('spec', 50, renderStaticFunctionTest);
features.registerRenderer('spec', 50, renderFreeFunctionTest);
features.registerRenderer('spec', 50, renderConstructorTest);
features.registerRenderer('spec', 50, renderTypeExpectations);
