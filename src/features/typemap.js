const extend = require('extend');
const features = require('../features');


function typemap(native, wrapped, renderer, options) {
  if (!this.typemaps)
    this.typemaps = [];

  var map = { native, wrapped, renderer };
  extend(map, options);
  this.typemaps.push(map);
  features.registerTypemap(map);
}

features.registerConfig(typemap);


// ----------------------------------------------------------------------------
// Swig rendering
// ----------------------------------------------------------------------------


function renderTypemap(tm) {
  var native = tm.native;
  var render = features.getTypemapRenderer(tm);

  if (!render) return '';

  var toNative = !render.toNative ? '' : `
#include <${native}.hxx>
%typemap(in) const ${native} &{
  // typemap inmap
  ${render.toNative('$input', '$1')}
}`;

  var toWrapped = `
%typemap(out) ${native} {
  //typemap outmap
  ${render.toWrapped('$1', '$result')}
}
%typemap(out) const ${native} & {
  //typemap outmap const &
  ${render.toWrapped('*$1', '$result')}
}
`;
  return toWrapped + toNative;
}


function renderTypemaps(decl) {
  if (!decl.typemaps) return false;

  var src = decl.typemaps
    .map(tm => renderTypemap(tm)).join('\n');

  return { name: 'typemaps.i', src };
}

features.registerRenderer('swig', 0, renderTypemaps);
