module.exports.renderJS = function(decl, parts) {
  if (decl.cls !== 'enum') return false;
  var source = decl.source();
  var values = decl.values.map(val => `${val[0]}: ${val[1]}`).join(',\n  ');
  var jsSrc = `\
mod.${decl.name} = {
${values}
}
`;
  return [{
    name: decl.parent + 'JS',
    src: jsSrc
  }];
};
