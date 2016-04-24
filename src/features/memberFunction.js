const features = require('../features.js');
const testLib = require('../testLib.js');

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
  if (decl.cls !== 'constructor' && decl.cls !== 'memfun' || decl.custom)
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
    var res = new ${cls.parent}.${calldef.name}(${args});
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('${cls.name}');`;

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

features.registerRenderer('spec', 50, renderMemberFunctionTest);
features.registerRenderer('spec', 50, renderStaticFunctionTest);
features.registerRenderer('spec', 50, renderFreeFunctionTest);
features.registerRenderer('spec', 50, renderConstructorTest);
