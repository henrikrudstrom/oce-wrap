const headers = require('../headers.js');
module.exports.name = 'headers';
module.exports.renderSwig = function(decl) {
  
  const modules = require('../modules.js')();
  var reader = require('../dependencies.js')(modules);
  if (decl.cls !== 'module') return false;
  var depends = decl.declarations
    .map((d) => reader.classDepends(d, { recursive: false }))
    .concat(decl.declarations.map(d => d.source().name))
    .concat(decl.declarations
      .map(d => (d.bases ? d.source().bases.map(b => b.name) : []))
      .reduce((a, b) => a.concat(b), [])
    )
    .reduce((a, b) => a.concat(b), [])
    .filter((d, index, array) => array.indexOf(d) === index)
    .filter(d => d !== 'undefined' && d !== undefined)
    .map(d => {
      // check if type is a wrapped type or a native header
      var res = modules.get(d);
      if (res === null) {
        if (headers.get(d) === null)
          return [];
      } else {
        d = res.key;
      }
      // TODO: use concat instead of reduce
      var handle = headers.get('Handle_' + d);
      if (handle !== null) {
        return [d, handle.name];
      }
      return [d];
    })
    .reduce((a, b) => a.concat(b), [])
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
