const features = require('../features.js');

function renderClass(cls, parts) {
  if (cls.declType !== 'class') return false;

  var base = '';
  if (cls.bases.length > 0) {
    base = ' : ' + cls.bases[0].access + ' ' + cls.bases[0].origName;
  }

  const src = `\
%nodefaultctor ${cls.origName};
class ${cls.origName}${base} {
	public:
    ${parts.get(cls.name + 'MemberFunctions')}
    ${parts.get(cls.name + 'Properties')}
};`;
  return [{
    name: 'classIncludes',
    src: `%include classes/${cls.origName}.i`
  }, {
    name: `classes/${cls.origName}.i`,
    src
  }];
}

features.registerRenderer('swig', 50, renderClass);



function renderClassSuite(cls, parts) {
  if (cls.declType !== 'class' || cls.abstract || cls.name.startsWith('Handle_'))
    return false;

  var imports = [cls.parent].concat(cls.getParent().moduleDepends || [])
    .map(mod => (`const ${mod} = require('../../lib/${mod}.js');
var ${mod}Create = require('../${mod}/create.js');`))
    .join('\n');

  var src = `\
${imports}
const create = require('../create.js');
const helpers = require('../testHelpers.js');
const expect = require('chai').expect;
describe('${cls.parent}.${cls.name}', function(){
${parts.get(cls.name + 'MemberSpecs')}
});
`;

  return { name: `${cls.name}AutoSpec.js`, src };
}
features.registerRenderer('spec', 70, renderClassSuite);
