const extend = require('extend');
const features = require('../features');


function typemap(native, wrapped, options) {
  if (!this.typemaps)
    this.typemaps = [];

  var map = { native, wrapped };
  extend(map, options);

  this.typemaps.push(map);
  features.registerTypemap(map);
}

function gpTypemap(native, wrapped, getter) {
  return this.typemap(native, wrapped, {
    getter,
    render: true,
    toNative: 'withAccessor',
    toWrapped: 'withConstructor'
  });
}




features.registerConfig(typemap);
features.registerConfig(gpTypemap);


// ----------------------------------------------------------------------------
// Swig rendering
// ----------------------------------------------------------------------------

function withAccessor(tm) {
  var message = `in method '" "$symname" "', argument " "$argnum"" of type '" "${tm.wrapped}""'`;
  return (nativeObj, wrappedObj) =>
    `void *argp ;
  int res = SWIG_ConvertPtr(${wrappedObj}, &argp, SWIGTYPE_p_${tm.wrapped},  0 );
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "${message}");
  }
  ${nativeObj} = (${tm.native} *)&((const ${tm.wrapped} *)(argp))->${tm.getter};`;
}

function withConstructor(tm) {
  return (nativeObj, wrappedObj) => {
    var arg = `(new ${tm.wrapped}((const ${tm.native} &) ${nativeObj}))`;
    var obj = `SWIG_NewPointerObj(${arg}, SWIGTYPE_p_${tm.wrapped}, SWIG_POINTER_OWN |  0);`;
    return `${wrappedObj} = ${obj}`;
  };
}



features.registerNativeConverter(withAccessor);
features.registerWrappedConverter(withConstructor);


function renderTypemap(tm) {
  var native = tm.native;
  var convert = features.getTypemapConverter(tm.native);

  return `
#include <${native}.hxx>
%typemap(in) const ${native} &{
  // typemap inmap
  ${convert.toNative('$1', '$input')}
}
%typemap(out) ${native} {
  //typemap outmap
  ${convert.toWrapped('$1', '$result')}
}
`;
}


function renderTypemaps(decl) {
  if (!decl.typemaps) return false;

  var src = decl.typemaps
    .filter(tm => tm.render)
    .map(tm => renderTypemap(tm)).join('\n');

  return [

    { name: 'typemaps.i', src }
  ];
}

features.registerRenderer('swig', 0, renderTypemaps);
