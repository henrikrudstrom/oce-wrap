const features = require('../features.js');

function renderClass(cls, parts) {
  if (cls.cls !== 'class') return false;
  var srcCls = cls.source();
  var base = '';
  if (srcCls.bases.length > 0) {
    base = ' : ' + srcCls.bases[0].access + ' ' + srcCls.bases[0].name;
  }

  const src = `\
%nodefaultctor ${srcCls.name};
class ${srcCls.name}${base} {
	public:
    ${parts.get(cls.name + 'MemberFunctions')}
    ${parts.get(cls.name + 'Properties')}
};`;
  return [{
    name: 'classIncludes',
    src: `%include classes/${srcCls.name}.i`
  }, {
    name: `classes/${srcCls.name}.i`,
    src
  }];
}

features.registerRenderer('swig', 50, renderClass);
