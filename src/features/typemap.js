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
    `${nativeObj} = (${tm.native} *)&((const ${tm.wrapped} *)(${wrappedObj}))->${tm.getter};`;
});

features.registerWrappedConverter(function withConstructor(tm) {
  return (nativeObj, wrappedObj) =>
    `${wrappedObj} = SWIG_NewPointerObj(
    (new ${tm.wrapped}((const ${tm.native}&)${wrappedObj})), SWIGTYPE_p_${tm.wrapped}, SWIG_POINTER_OWN |  0
  );`;
});



features.registerNativeConverter(function ArrayToIndexedMap(tm) {

});
features.registerNativeConverter(function IndexedMapToArray(tm) {

});









function renderTypemap(tm) {
  var native = tm.native;
  var wrapped = tm.wrapped;
  var toNative = features.getNativeConverter(tm.toNative, tm);
  var toWrapped = features.getWrappedConverter(tm.toWrapped, tm);

  return `\
%typemap(in) ${native} &{
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_${wrapped},  0 );
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "in method '" "$symname" "', argument " "$argnum"" of type '" "${wrapped}""'");
  }
  ${toNative('$1', 'argp')}
  //$1 = (${native} *)&((const ${wrapped} *)(argp))->${tm.getter};
}
%typemap(out) ${native} {
  ${toWrapped('$1', '$result')}
  //$result = SWIG_NewPointerObj((new ${wrapped}((const ${native}&)$1)), SWIGTYPE_p_${wrapped}, SWIG_POINTER_OWN |  0 );
}`;
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
