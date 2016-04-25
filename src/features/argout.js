const camelCase = require('camel-case');
const features = require('../features.js');
const common = require('../common.js');


// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------

function defineArgout(mem, type) {
  var outArgIndexes = mem.arguments
    .map((arg, index) => index)
    .filter(index => mem.arguments[index].decl.indexOf('&') !== -1);

  if (outArgIndexes.length < 1) return false;

  // out arguments to argouts property
  mem.argouts = outArgIndexes.map(index => mem.arguments[index]);
  mem.arguments = mem.arguments.filter((arg, index) => outArgIndexes.indexOf(index) === -1);

  if (mem.argouts.length > 1)
    mem.returnType = type;
  else
    mem.returnType = mem.argouts[0].type;

  return true;
}

function argout(expr, type) {
  if (type === undefined)
    throw new Error('argout type must be specified');

  this.pushQuery(6, expr, (mem) => {
    if (mem.cls !== 'memfun') return false;
    defineArgout(mem, type);
    return true;
  });
}

// function argoutArray(expr) {
//   return this.argout(expr, 'Array');
// }

function argoutObject(expr) {
  return this.argout(expr, 'Object');
}

function defaultArgouts() {
  this.pushMethod(6, () => {
    this.declarations.forEach(decl => {
      var src = decl; // TODO: should be decl.source();
      var outarg = src.arguments.some(arg =>
        arg.decl.indexOf('&') !== -1 && arg.decl.indexOf('const') === -1
      );
      if (!outarg) return;
      defineArgout(decl, 'Object');
    });
  });
}

features.registerConfig(argout, defaultArgouts, /* argoutArray,*/ argoutObject);


// ----------------------------------------------------------------------------
// Render swig
// ----------------------------------------------------------------------------

function swigConvert(type, arg) {
  type = common.stripTypeQualifiers(type);

  if (type.indexOf('Standard_Real') !== -1)
    return { expr: `SWIGV8_NUMBER_NEW(*${arg})` };
  if (type.indexOf('Standard_Boolean') !== -1)
    return { expr: `SWIGV8_BOOLEAN_NEW(*${arg})` };
  if (type.indexOf('Standard_Integer') !== -1)
    return { expr: `SWIGV8_INTEGER_NEW(*${arg})` };

  var typemap = features.getTypemapConverter(type);
  if (typemap === null) {
    var castedArg = `(new ${type}((const ${type})*${arg})`;
    return {
      expr: `SWIG_NewPointerObj(${castedArg}), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`
    };
  }
  return {
    expr: 'value',
    statements: 'v8::Handle<v8::Value> ' + typemap.toWrapped(arg, 'value', '$1')
  };
}

// function renderArrayOutmap(argouts, sigArgs) {
//   var assignArgs = argouts
//     .map((arg, index) => `  array->Set(${index}, ${swigConvert(arg.decl, '$' + (index + 1))});`)
//     .join('\n');

//   return `%typemap(argout) (${sigArgs}) {// argoutout\n
//     v8::Handle<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), 4);
//   ${assignArgs}
//     $result = array;
//   }`;
// }

function renderObjectOutmap(argouts, sigArgs) {
  var assignArgs = argouts
    .map((arg, index) => {
      var key = `SWIGV8_STRING_NEW("${camelCase(arg.name)}")`;
      var value = swigConvert(arg.decl, '$' + (index + 1));

      var res = `obj->Set(${key}, ${value.expr});`;

      if (!value.statements)
        return res;

      return `{\n${value.statements}\n${res}\n}`;
    })
    .join('\n');

  return `%typemap(argout) (${sigArgs}) {// argoutout\n
    v8::Local<v8::Object> obj = SWIGV8_OBJECT_NEW();
  ${assignArgs}
    $result = obj;
  }`;
}

function renderSingleValueOutmap(args, sigArgs) {
  var arg = args[0];
  var value = swigConvert(arg.decl, '$1');
  if (args.length > 1)
    throw new Error('single value outmap can only be used with single arg');
  return `%typemap(argout) (${sigArgs}) {// argoutout\n
${value.statements || '\n'}\
   $result = ${value.expr};
  }`;
}

function renderArgouts(decl) {
  if (!decl.argouts) return false;

  var sigArgs = decl.argouts
    .map(arg => `${arg.decl}${arg.name}`)
    .join(', ');

  var defArgs = decl.argouts
    .map((arg, index) => `${common.stripTypeQualifiers(arg.decl)} argout${index + 1}`)
    .join(', ');

  var tmpArgs = decl.argouts
    .map((arg, index) => `  $${index + 1} = &argout${index + 1};`)
    .join('\n');

  var inMap = `%typemap(in, numinputs=0) (${sigArgs}) (${defArgs}) {\n// argoutin\n ${tmpArgs}\n}`;

  var outMap;
  if (decl.argouts.length === 1)
    outMap = renderSingleValueOutmap(decl.argouts, sigArgs);
  else if (decl.returnType === 'Array')
    outMap = renderArrayOutmap(decl.argouts, sigArgs);
  else
    outMap = renderObjectOutmap(decl.argouts, sigArgs);

  var comment = `// typemap for ${decl.name}`;
  return {
    name: 'typemaps.i',
    src: [comment, inMap, outMap].join('\n')
  };
}

features.registerRenderer('swig', 0, renderArgouts);


// ----------------------------------------------------------------------------
// Render test Expectations
// ----------------------------------------------------------------------------

function renderArgoutExpectations(decl) {
  if (!decl.argouts || decl.argouts.length < 2)
    return false;

  var name = decl.parent + '.' + common.signature(decl) + 'Expectations';

  var src = decl.argouts
    .map(arg => `\n    helpers.expectType(res.${arg.name}, '${arg.type}');`)
    .join('');

  return { name, src };
}
features.registerRenderer('spec', 40, renderArgoutExpectations);
