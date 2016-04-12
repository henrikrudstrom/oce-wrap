var fs = require('fs');
var path = require('path');
var settings = require('../settings.js');

function renderTypedef(td) {
  return `typedef ${td.source().type} ${td.source().name};`;
}

module.exports.name = 'module'

function renderEnum(en) {
  var values = en.source().values.map(function(v) {
    return `  ${v[0]} = ${v[1]}`;
  }).join(',\n');
  return `enum ${en.source().name} {\n${values}\n};`;
}



module.exports.renderSwig = function(decl, parts) {
  if (decl.cls !== 'module')
    return false;

  var typedefs = decl.declarations
    .filter((d) => d.cls === 'typedef')
    .map(renderTypedef);

  var enums = decl.declarations
    .filter((d) => d.cls === 'enum')
    .map(renderEnum);

  function includeIfExists(name) {
    var file = path.join(settings.paths.definition, 'modules', decl.name, name);
    return fs.existsSync(file) ? `%include "${name}"` : `// ${name} not present`;
  }
  var typemaps = decl.typemaps ? '%include "typemaps.i"' : '// no typemaps';

  return {
    name: 'module.i',
    src: `\
// Module ${decl.name}
// dependencies
${parts.get('moduleDepends')}


%module(package="OCC") ${decl.name}
%include ../common/ModuleHeader.i
%include "headers.i"
//%include "properties.i"

${parts.get('featureIncludes')}
${includeIfExists('extra.i')}
${typemaps}
${typedefs.join('\n')}
${enums.join('\n')}
${parts.get('classIncludes')}
`
  };
};
