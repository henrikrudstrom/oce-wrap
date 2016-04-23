const features = require('../features.js');
const testLib = require('../testLib.js');
const common = require('../common.js');
var modules;

//
// swig rendering
//

function renderArg(arg) {
  var res = arg.decl + ' ' + arg.name;
  // TODO: pythonocc removes byrefs on gp module...
  // res = res.replace('&', '')
  if (arg.default) {
    res += '=' + arg.default;
  }
  return res;
}

function renderMemberFunction(decl) {
  if (decl.cls !== 'constructor' && decl.cls !== 'memfun')
    return false;

  var source = decl.source();
  var args = source.arguments.map(renderArg).join(', ');
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


function renderTest(member, testSrc) {
  var cls = member.getParent();
  var signature = common.signature(member);

  var excluded = testLib.excluded(cls.qualifiedName, member);
  if (excluded)
    return '  // ' + excluded;

  var comment = '';
  var pending = testLib.pending(cls.qualifiedName, member);
  if (pending)
    comment = '  // ' + pending + '\n';

  var disable = pending ? 'x' : '';
  var src = `\n${comment}
  ${disable}it('${signature}', function(){
${testSrc}
  });`;
  return src;
}

function renderMemberFunctionTest(calldef) {
  if (calldef.cls !== 'memfun')
    return false;

  var cls = calldef.getParent();
  var args = calldef.arguments.map(arg => testLib.createValue(arg.type)).join(', ');
  var testSrc = `\
    var obj = create.${cls.parent}.${cls.name}();
    var res = obj.${calldef.name}(${args});`;

  var returnType = testLib.memberReturnType(cls, calldef, cls.parent + '.' + cls.name);
  testSrc += testLib.expectType(returnType).map(l => '\n    ' + l).join('');

  return {
    name: cls.name + 'MemberFunctionSpecs',
    src: renderTest(calldef, testSrc)
  };
}

function renderConstructorTest(calldef) {
  if (calldef.cls !== 'constructor')
    return false;
  var cls = calldef.getParent();
  var args = calldef.arguments.map(arg => testLib.createValue(arg.type)).join(', ');

  var src = `\
    var res = new ${cls.parent}.${calldef.name}(${args});
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${cls.name}');`;
  return {
    name: cls.name + 'MemberFunctionSpecs',
    src: renderTest(calldef, src)
  };
}

function renderStaticFunctionTest(calldef) {
  if (calldef.cls !== 'staticfunc' || calldef.getParent().cls !== 'class')
    return false;

  var cls = calldef.getParent();
  var args = calldef.arguments.map(arg => testLib.createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${cls.parent}.${cls.name}.${calldef.name}(${args});`;

  var returnType = testLib.memberReturnType(cls, calldef, cls.qualifiedName);
  testSrc += testLib.expectType(returnType).map(l => '\n    ' + l).join('');

  return {
    name: cls.name + 'MemberFunctionSpecs',
    src: renderTest(calldef, testSrc)
  };
}

function renderFreeFunctionTest(calldef) {
  if (calldef.cls !== 'staticfunc' || calldef.getParent().cls !== 'module')
    return false;

  var mod = calldef.getParent();
  var args = calldef.arguments.map(arg => testLib.createValue(arg.type)).join(', ');
  var testSrc = `\
    var res = ${mod.name}.${calldef.name}(${args});`;
  var sig = common.signature(calldef);

  var excluded = testLib.excluded(mod.name, calldef);
  if (excluded)
    return '  // ' + excluded;

  var comment = '';
  var pending = testLib.pending(mod.name, calldef);
  if (pending)
    comment = '  // ' + pending + '\n';

  var returnType = testLib.memberReturnType(mod, calldef, mod.name);
  testSrc += testLib.expectType(returnType).map(l => '\n    ' + l).join('');
  var disable = pending ? 'x' : '';
  var src = `\n${comment}
  ${disable}it('${sig}', function(){
${testSrc}
  });`;
  return {
    name: mod.name + 'FunctionSpecs',
    src
  };
}

// function renderMemberTest(decl) {
//   if (decl.cls !== 'memfun' && decl.cls !== 'staticfunc' && decl.cls !== 'constructor')
//     return false;
//
//   var parent = decl.getParent();
//
//   if (parent.cls === 'module')
//     return {
//       name: parent.name + 'ModuleFunctionSpecs',
//       src: renderFreeFunctionTest(decl)
//     };
//
//   var src;
//   if (decl.static === '1')
//     src = renderStaticFunctionTest(decl);
//   else
//     src = renderMemberFunctionTest(decl);
//
//
//   return {
//     name: parent.name + 'MemberFunctionSpecs',
//     src
//   };
// }

features.registerRenderer('spec', 50, renderMemberFunctionTest);
features.registerRenderer('spec', 50, renderStaticFunctionTest);
features.registerRenderer('spec', 50, renderFreeFunctionTest);
features.registerRenderer('spec', 50, renderConstructorTest);
