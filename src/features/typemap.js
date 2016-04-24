const features = require('../features');

// 'hides' a type that can be directly mapped to a similar type, only implemented for types
// that have an accessor function to the 'hidden' type. i.e gp_Vec->XYZ() etc.
// TODO: should get a better name

function typemap(from, to, getter) {
  if (!this.typemaps)
    this.typemaps = [];

  this.typemaps.push({ from, to, getter, render: getter !== undefined });
}

features.registerConfig(typemap);

function renderTypemap(fromType, toType, getter) {
  return `\
%typemap(in) ${fromType} &{
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_${toType},  0 );
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "in method '" "$symname" "', argument " "$argnum"" of type '" "${toType}""'");
  }
  $1 = (${fromType} *)&((const ${toType} *)(argp))->${getter};
}
%typemap(out) gp_XYZ {
  $result = SWIG_NewPointerObj((new ${toType}((const ${toType}&)$1)), SWIGTYPE_p_${toType}, SWIG_POINTER_OWN |  0 );
}`;
}

function renderTypemaps(decl) {
  if (!decl.typemaps) return false;
  var src = decl.typemaps
    .filter(tm => tm.render)
    .map(tm => renderTypemap(tm.from, tm.to, tm.getter)).join('\n');
  return { name: 'typemaps.i', src };
}

features.registerRenderer('swig', 0, renderTypemaps);
