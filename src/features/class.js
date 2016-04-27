const features = require('../features.js');

function renderClass(cls, parts) {
  if (cls.cls !== 'class') return false;

  var base = '';
  if (cls.bases.length > 0) {
    base = ' : ' + cls.bases[0].access + ' ' + cls.bases[0].originalName;
  }

  const src = `\
%nodefaultctor ${cls.originalName};
class ${cls.originalName}${base} {
	public:
    ${parts.get(cls.name + 'MemberFunctions')}
    ${parts.get(cls.name + 'Properties')}
};`;
  return [{
    name: 'classIncludes',
    src: `%include classes/${cls.originalName}.i`
  }, {
    name: `classes/${cls.originalName}.i`,
    src
  }];
}

features.registerRenderer('swig', 50, renderClass);



function renderClassSuite(cls, parts) {
  if (cls.cls !== 'class' || cls.abstract || cls.name.startsWith('Handle_'))
    return false;

  var imports = [cls.parent].concat(cls.moduleDepends || [])
    .map(mod => (`var ${mod} = require('../../lib/${mod}.js');`))
    .join('\n');

  var src = `\
${imports}
var create = require('../create.js');
var helpers = require('./testHelpers.js');
describe('${cls.parent}.${cls.name}', function(){
${parts.get(cls.name + 'MemberSpecs')}
});
`;

  return { name: `${cls.name}AutoSpec.js`, src };
}
features.registerRenderer('spec', 70, renderClassSuite);
