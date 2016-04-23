const features = require('../features.js');
const camelCase = require('camel-case');

function argout(expr, type) {
  if (type === undefined) throw new Error('argout type must be specified');
  this.pushToStack(5, expr, (mem) => {
    if (mem.cls !== 'memfun') return false;

    var outArgIndexes = mem.arguments
      .map((arg, index) => index)
      .filter(index => mem.arguments[index].decl.indexOf('&') !== -1);
    if (outArgIndexes.length < 1) return false;

    // out arguments to argouts property
    mem.argouts = outArgIndexes.map(index => mem.arguments[index]);
    mem.arguments = mem.arguments.filter((arg, index) => outArgIndexes.indexOf(index) === -1);
    mem.returnType = type;

    return true;
  });
}

function argoutArray(expr) {
  return this.argout(expr, 'Array');
}

function argoutObject(expr) {
  return this.argout(expr, 'Object');
}

features.registerConfig(argout, argoutArray, argoutObject);


function swigConvert(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIG_From_double(*${arg})`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIG_From_bool(*${arg})`;
  if (type.indexOf('Standard_Integer') !== -1)
    return `SWIG_From_int(*${arg})`; // TODO: not sure this one exists
  return `SWIG_NewPointerObj((new ${type}((const ${type})*${arg})), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`;
}

function renderArrayOutmap(argouts, sigArgs) {
  var assignArgs = argouts
    .map((arg, index) => `  array->Set(${index}, ${swigConvert(arg.type, '$' + (index + 1))});`)
    .join('\n');

  return `%typemap(argout) (${sigArgs}) {// argoutout\n
    v8::Handle<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), 4);
  ${assignArgs}
    $result = array;
  }`;
}

function renderObjectOutmap(argouts, sigArgs) {
  var assignArgs = argouts
    .map((arg, index) => {
      var key = `SWIGV8_STRING_NEW("${camelCase(arg.name)}")`;
      var value = swigConvert(arg.type, '$' + (index + 1));
      return `  obj->Set(${key}, ${value});`;
    })
    .join('\n');

  return `%typemap(argout) (${sigArgs}) {// argoutout\n
    v8::Local<v8::Object> obj = SWIGV8_OBJECT_NEW();
  ${assignArgs}
    $result = obj;
  }`;
}

function renderArgouts(decl) {
  if (!decl.argouts) return false;

  var sigArgs = decl.argouts
    .map(arg => `${arg.decl}${arg.name}`)
    .join(', ');

  var defArgs = decl.argouts
    .map((arg, index) => `${arg.type} argout${index + 1}`)
    .join(', ');

  var tmpArgs = decl.argouts
    .map((arg, index) => `  $${index + 1} = &argout${index + 1};`)
    .join('\n');

  var inMap = `%typemap(in, numinputs=0) (${sigArgs}) (${defArgs}) {\n// argoutin\n ${tmpArgs}\n}`;
  var outMap = decl.returnType === 'Array' ?
    renderArrayOutmap(decl.argouts, sigArgs) :
    renderObjectOutmap(decl.argouts, sigArgs);

  return {
    name: 'typemaps.i',
    src: [inMap, outMap].join('\n')
  };
}

features.registerRenderer('swig', 0, renderArgouts);
