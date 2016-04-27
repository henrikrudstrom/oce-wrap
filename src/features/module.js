const fs = require('fs');
const path = require('path');
const settings = require('../settings.js');
const features = require('../features');

function renderModuleJs(decl, parts) {
  if (decl.cls !== 'module')
    return false;

  var reqs = '';
  if (decl.moduleDepends)
    reqs = decl.moduleDepends
    .map(r => `const ${r} = require('./${r}.js');`)
    .join('\n');

  return {
    name: decl.name + '.js',
    src: `\
${reqs}
const mod = require('./${decl.name}.node');
${parts.get(decl.name + 'JS')}

module.exports = mod;
`
  };
}


function renderModuleSwig(decl, parts) {
  if (decl.cls !== 'module')
    return false;

  function includeIfExists(name) {
    var file = path.join(settings.paths.definition, 'modules', decl.name, name);
    return fs.existsSync(file) ? `%include "${name}"` : `// ${name} not present`;
  }

  function includeIfDefined(partName) {
    return parts.contains(partName) ? `%include "${partName}"` : '';
  }
  var typemaps = decl.typemaps ? '%include "typemaps.i"' : '// no typemaps';

  return {
    name: 'module.i',
    src: `\
// Module ${decl.name}
%module(package="OCC") ${decl.name}
${parts.get('moduleIncludes')}
%include ../common/ModuleHeader.i
%include "headers.i"

// dependencies
${parts.get('moduleDepends')}


// %include "properties.i"

${parts.get('featureIncludes')}
${includeIfExists('extra.i')}
${typemaps}


${parts.get('handles')}
${parts.get('classIncludes')}
${parts.get('extends')}
${includeIfDefined('extends.i')}
`
  };
}

function renderModuleSpec(mod, parts) {
  if (mod.cls !== 'module')
    return false;

  var imports = [mod.name].concat(mod.moduleDepends || [])
    .map(m => (`var ${m} = require('../../lib/${m}.js');`))
    .join('\n');

  var src = `\
${imports}
var helpers = require('./testHelpers.js');
var create = require('../create.js');

describe('${mod.name}', function(){
${parts.get(mod.name + 'ModuleSpecs')}
});
`;
  return {
    name: mod.name + 'AutoSpec.js',
    src
  };
}


features.registerRenderer('js', 100, renderModuleJs);
features.registerRenderer('swig', 100, renderModuleSwig);
features.registerRenderer('spec', 100, renderModuleSpec);
