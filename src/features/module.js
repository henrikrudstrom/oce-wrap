function renderTypedef(td) {
  return `typedef ${td.type} ${td.name};`;
}

module.exports.name = 'module'
function renderEnum(en) {
  var values = en.values.map(function(v) {
    return `  ${v[0]} = ${v[1]}`;
  }).join(',\n');
  return `enum ${en.name} {\n${values}\n};`;
}

module.exports.renderSwig = function(decl, parts) {
  if(decl.cls !== 'module') 
    return;
    
  var typedefs = decl.declarations
    .filter((d) => d.cls === 'typedef')
    .map(renderTypedef);
  
  var enums = decl.declarations
    .filter((d) => d.cls === 'enum')
    .map(renderEnum);
    
  return {
    name: 'module.i',
    src: `\
// Module ${decl.name}
// dependencies
// {dependantModules}
// {dependantHeaders}

%module(package="OCC") ${decl.name}
%include ../../user/common/ModuleHeader.i
%include headers.i

${parts.get('featureIncludes')}

${typedefs}
${enums}
${parts.get('classIncludes')}
`
  };
};
