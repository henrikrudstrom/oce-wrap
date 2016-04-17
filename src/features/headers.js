module.exports.renderSwig = function(decl) {
  var reader = require('../dependencies.js')();
  if (decl.cls !== 'module') return false;
  var depends = decl.declarations
    .map((d) => reader.classDepends(d, false))
    .concat(decl.declarations.map(d => d.source().name))
    .concat(decl.declarations
      .map(d => (d.bases ? d.source().bases.map(b => b.name) : []))
      .reduce((a, b) => a.concat(b), [])
    )
    .reduce((a, b) => a.concat(b), [])
    .filter((d, index, array) => array.indexOf(d) === index)
    .map((d) => `#include <${d}.hxx>`)
    .join('\n');

  return {
    name: 'headers.i',
    src: `
%{
${depends}
%}`
  };
};
