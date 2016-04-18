const modules = require('../modules.js')();
module.exports.renderSwig = function(decl) {
  var reader = require('../dependencies.js')(modules);
  if (decl.cls !== 'module') return false;
  var depends = decl.declarations
    .map((d) => reader.classDepends(d, { recursive: true }))
    .concat(decl.declarations.map(d => d.source().name))
    .concat(decl.declarations
      .map(d => (d.bases ? d.source().bases.map(b => b.name) : []))
      .reduce((a, b) => a.concat(b), [])
    )
    .reduce((a, b) => a.concat(b), [])
    .filter((d, index, array) => array.indexOf(d) === index)
    .filter(d => d !== 'undefined' && d !== undefined)
    .map(d => {
      var res = modules.get(d);
      console.log(d, typeof res)
      if(typeof res === 'string')
        return null;
      if (res !== null && res !== undefined && res !== 'undefined' && typeof res !== 'string') 
        return res.key;
      return d;
    })
    .filter(d => d !== null)
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
