var conf = require('../conf.js');
conf.Conf.prototype.typemap = function(from, to, getter) {
  if (!this.typemaps)
    this.typemaps = [];
  this.typemaps.push({ from, to, getter });
};

function typemap(fromType, toType, getter) {
  return `\
%typemap(in) ${fromType} &{
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_${toType},  0 );
  $1 = &((${toType} *)(argp))->${getter};
}
%typemap(out) gp_XYZ {
  $result = SWIG_NewPointerObj((new ${toType}((const ${toType}&)$1)), SWIGTYPE_p_${toType}, SWIG_POINTER_OWN |  0 );
}`;
//   return `\
// %typemap(in) ${fromType} &{
//   void *argp ;
//   int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_${toType},  0 );
//   $1 = &(((${toType} *)(argp))->${getter};
// }
// %typemap(out) gp_XYZ {
//   $result = SWIG_NewPointerObj((new ${toType}((const ${toType}&)$1)), SWIGTYPE_p_${toType}, SWIG_POINTER_OWN |  0 );
// }`;
}
module.exports.renderSwig = function(decl) {
  if (!decl.typemaps) return false;
  var src = decl.typemaps
    .map(tm => typemap(tm.from, tm.to, tm.getter)).join('\n');
  return { name: 'typemaps.i', src };
};
