const extend = require('extend');
const features = require('../features');

// 'hides' a type that can be directly mapped to a similar type, only implemented for types
// that have an accessor function to the 'hidden' type. i.e gp_Vec->XYZ() etc.
// TODO: should get a better name

function typemap(native, wrapped, options) {
  if (!this.typemaps)
    this.typemaps = [];

  var map = { native, wrapped };
  extend(map, options);

  this.typemaps.push(map);
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

features.registerNativeConverter(function withAccessor(tm) {
  return (nativeObj, wrappedObj) =>
    `void *argp ;
  int res = SWIG_ConvertPtr(${wrappedObj}, &argp, SWIGTYPE_p_${tm.wrapped},  0 );
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "in method '" "$symname" "', argument " "$argnum"" of type '" "${tm.wrapped}""'");
  }
  ${nativeObj} = (${tm.native} *)&((const ${tm.wrapped} *)(argp))->${tm.getter};`;
});

features.registerWrappedConverter(function withConstructor(tm) {
  return (nativeObj, wrappedObj) =>
    `${wrappedObj} = SWIG_NewPointerObj(
    (new ${tm.wrapped}((const ${tm.native} &)${wrappedObj})), SWIGTYPE_p_${tm.wrapped}, SWIG_POINTER_OWN |  0
  );`;
});


function renderTypemap(tm) {
  var native = tm.native;
  var wrapped = tm.wrapped;
  var toNative = features.getNativeConverter(tm.toNative, tm);
  var toWrapped = features.getWrappedConverter(tm.toWrapped, tm);
  var arginDef = `(${native} argin)`
  var arginInit = '&argin'
  if (tm.initArgout) {
    arginDef = '';
    arginInit = tm.initArgout;
  }
  var freearg = tm.freearg ? `%typemap(freearg) ${native} & {
  ${tm.freearg}; 
}` : '';
  return `\
#include <${native}.hxx>

%typemap(in) const ${native} &{
  // typemap inmap
  ${toNative('$1', '$input')}
}
%typemap(out) ${native} {
  //typemap outmap
  ${toWrapped('$1', '$result')}
}

%typemap(argout) ${native} & {
  //typemap argoutmap
  ${toWrapped('$1', '$result')}
}
%typemap(in) ${native} & ${arginDef}{
  //typemap arginmap
  $1 = ${arginInit};
}
${freearg}
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
