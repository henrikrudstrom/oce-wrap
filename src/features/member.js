const features = require('../features.js');

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
