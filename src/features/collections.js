var conf = require('../conf.js');

function parseName(name) {
  name = name.split('_')[1];
  var res = name.match('(Array1)Of(\w+)');
  return { collType: res[1], type: res[2] };


}

conf.Configuration.prototype.collection(expr) {
  this.include(expr);
  this.find(expr).forEach(coll => {
    coll.exclude('*');
    coll.include(`${coll.name}()`)
  })
}

function swigConvert(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIG_From_double(*${arg})`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIG_From_bool(*${arg})`;
  if (type.indexOf('Standard_Integer') !== -1)
    return `SWIG_From_int(*${arg})`; // TODO: not sure this one exists

  return `SWIG_NewPointerObj((new ${type}((const ${type}&)${arg})), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`;
}

module.exports.renderSwig = function(decl) {
    if (!decl.argouts) return false;
    var sigArgs = decl.argouts
      .map(arg => `${arg.decl}${arg.name}`)
      .join(', ')

    var defArgs = decl.argouts
      .map((arg, index) => `${arg.type} argout${index+1}`)
      .join(', ')

    var tmpArgs = decl.argouts
      .map((arg, index) => `  $${index+1} = &argout${index+1};`)
      .join('\n');

    var assignArgs = decl.argouts
      .map((arg, index) => `  array->Set(${index}, ${swigConvert(arg.type, '$'+(index+1))});`)
      .join('\n');

    function tColgp_Array1(type) {
      var inMap = `%typemap(in, numinputs=0) (${sigArgs}) (${defArgs}) {\n// argoutin\n ${tmpArgs}\n}`
      var outMap = `
%typemap(argout) tColgp_Array1 {// argoutout
  v8::Handle<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), 4);
  for(int i = $1->Lower(); i < $1->Upper(); i++) {
    v8::Handle<v8::Value> value = SWIG_NewPointerObj((new ${type}((const ${type}&)$1->Value(i))), SWIGTYPE_p_${type}, $owner )
    array->Set(i, value);
  }
  $result = array;
}`;
    }
