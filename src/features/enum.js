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

function renderEnumTypemap(decl) {
  if (decl.declType !== 'enum') return false;
  return {
    name: 'typemaps.i',
    src: `\
%typemap(in) ${decl.origName} {
  int value;
  SWIG_AsVal_int($input, &value);
  $1 = static_cast<${decl.origName}>(value);
}
%typemap(out) ${decl.origName} {
  $result = SWIGV8_NUMBER_NEW(static_cast<int>($1));
}
    `
  };
}
// function enumToString(enum){
//   var src = `switch()`
//   enum.values.map(val => {
//
//   })
//
// }
//
// function renderStringEnumTypemap(decl) {
//   if (decl.declType !== 'enum') return false;
//   return {
//     name: 'typemaps.i',
//     src: `%typemap(in) ${decl.origName} {
//       string value;
//       SWIG_AsVal_int($input, &value);
//       $1 = static_cast<${decl.origName}>(value);
//     }
//     `
//   }
// }

features.registerRenderer('js', 0, renderEnum);
features.registerRenderer('swig', 0, renderEnumTypemap);
