const features = require('../features');

function renderEnum(decl) {
  if (decl.declType !== 'enum') return false;
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
}

features.registerRenderer('js', 0, renderEnum);
