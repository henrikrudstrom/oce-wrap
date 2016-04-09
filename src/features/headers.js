var classDepends = require('../dependencies.js');
module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'module' || decl.moduleDepends === undefined) return false;
  var depends = decl.declarations
    .map((d) => classDepends(d, false))
    .reduce((a, b) => a.concat(b), [])
    .filter((d, index, array) => array.indexOf(d) === index)
    .map((d) => `#include <${d}>`)
    .join('\n');

  return {
    name: 'headers',
    src: `
%{
${depends}
%}`
  };
};
