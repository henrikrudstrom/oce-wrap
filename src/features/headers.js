const modules = require('../modules.js')();
module.exports.renderSwig = function(decl) {
  var reader = require('../dependencies.js')();
  if (decl.cls !== 'module') return false;
  var depends = decl.declarations
    .map((d) => reader.classDepends(d.source(), false))
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
