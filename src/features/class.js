module.exports.name = 'class'

function renderArg(arg) {
  var res = arg.decl + ' ' + arg.name;
  if (arg.default) {
    res += '=' + arg.default;
  }
  return res;
}

function renderFunction(func) {
  var args = func.arguments.map(renderArg).join(', ');
  var stat = func.static ? 'static ' : '';
  var cons = func.const ? 'const ' : '';
  return `
    %feature("compactdefaultargs") ${func.name};
    ${stat}${cons}${func.returnType + ' '}${func.name}(${args});`;
}

module.exports.renderSwig = function(cls, parts) {
  if(cls.cls !== 'class') return;
  
  var base = '';
  if (cls.bases.length > 0) {
    base = ' : ' + cls.bases[0].access + ' ' + cls.bases[0].name;
  }
  const constructors = cls.declarations
    .filter((mem) => mem.cls === 'constructor')
    .map(renderFunction).join('');
    
  const functions = cls.members
    .filter((mem) => mem.cls !== 'constructor')
    .map(renderFunction).join('');
    
  const src = `\
%nodefaultctor ${cls.name};
class ${cls.name}${base} {
	public:
    /* Constructors */
    ${constructors}
    /* Member functions */
    ${parts(cls.name+'Properties')}
    ${functions}
};`;
  return [
{
      name: 'classIncludes',
      src: `%include classes/${cls.name}`
    },
    {
      name: `classes/${cls.name}.i`,
      src: src
    }
  ];
}