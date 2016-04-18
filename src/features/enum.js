module.exports.renderJS = function(decl, parts) {
  if (decl.cls !== 'enum') return false;
  var values = decl.values.map(val => `${val[0]}: ${val[1]}`).join(',\n  ');
  return {
    name: decl.parent + 'JS',
    src: `\
mod.${decl.name} = {
  ${values}
}
`
  };
};
