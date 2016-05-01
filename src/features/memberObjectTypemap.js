const features = require('../features.js');

function withAccessor(input, output, native, wrapped, getter) {
  var message = `in method '" "$symname" "', argument " "$argnum"" of type '" "${wrapped}""'`;
  return `void *argp ;
  int res = SWIG_ConvertPtr(${input}, &argp, SWIGTYPE_p_${wrapped},  0 );
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "${message}");
  }
  ${output} = (${native} *)&((const ${wrapped} *)(argp))->${getter};`;
}

function withConstructor(input, output, native, wrapped) {
  var arg = `(new ${wrapped}((const ${native} &) ${input}))`;
  var obj = `SWIG_NewPointerObj(${arg}, SWIGTYPE_p_${wrapped}, SWIG_POINTER_OWN |  0);`;
  return `${output} = ${obj}`;
}

features.registerTypemapRenderer('member-object', function convertTypeRenderer(tm) {
  return {
    toNative(input, output) {
      return withAccessor(input, output, tm.native, tm.wrapped, 'XYZ()');
    },
    toWrapped(input, output) {
      return withConstructor(input, output, tm.native, tm.wrapped);
    }
  };
});
