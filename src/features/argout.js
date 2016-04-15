const conf = require('../conf.js');
module.exports.name = 'asStatic';
conf.Conf.prototype.argout = function argout(expr){
  this.transform(expr, (mem) => {
    if (mem.cls !== 'memfun') return false;
    var outArgIndexes = mem.arguments
      .map((arg, index) => index)
      .filter(index => mem.arguments[index].decl.indexOf('&') !== -1);
    if(outArgIndexes.length < 1) return false;

    // out arguments to argouts property
    mem.argouts = outArgIndexes.map(index => mem.arguments[index])
    mem.arguments = mem.arguments.filter((arg, index) => outArgIndexes.indexOf(index) === -1)
    mem.returnType = 'Array';
  });

}
conf.MultiConf.prototype.argout = function property(getter, setter) {
  this.map((decl) => decl.argout(getter, setter));
  return this;
};


function swigConvert(type, arg){
  console.log("swig convert: " + type)
  if(type.indexOf('Standard_Real') ==! -1)
    return `SWIG_From_double(*${arg})`;
  if(type.indexOf('Standard_Boolean') ==! -1)
    return `SWIG_From_bool(*${arg})`;
  if(type.indexOf('Standard_Integer') ==! -1)
    return `SWIG_From_int(*${arg})`; // TODO: not sure this one exists

  return `SWIG_NewPointerObj((new ${type}((const ${type}&)${arg})), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`;



}

module.exports.renderSwig = function(decl){
  if(!decl.argouts) return false;
  console.log("RENDER TYPEMAP")
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

  var inMap = `%typemap(in, numinputs=0) (${sigArgs}) (${defArgs}) {\n// argoutin\n ${tmpArgs}\n}`
  var outMap = `%typemap(argout) (${sigArgs}) {// argoutout\n
  v8::Handle<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), 4);
${assignArgs}
  $result = array;
}`;
  return {
    name: 'typemaps.i',
    src: [inMap, outMap].join('\n')
  };
}
