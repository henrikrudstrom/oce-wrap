const extend = require('extend');
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
  mem.argouts = outArgIndexes.map(
    index => extend({index}, mem.arguments[index])
  );
  //mem.argouts.forEach((arg, i) => arg.index = )
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
      console.log("DEF", decl.name)
      var src = decl; // TODO: should be decl.source();
      if(!src.arguments) return;
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
    statements: 'v8::Handle<v8::Value> value;\n  ' + typemap.toWrapped(arg, 'value', '$1') + '\n'
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

function renderObjectOutmap(decl, fullSig) {
  var assignArgs = decl.argouts
    .map((arg, index) => {
      var key = `SWIGV8_STRING_NEW("${camelCase(arg.name)}")`;
      var value = swigConvert(arg.decl, '$' + (index + 1));

      var res = `obj->Set(${key}, ${value.expr});`;

      if (!value.statements)
        return res;

      return `{\n${value.statements}\n${res}\n}`;
    })
    .join('\n');

  return `%typemap(argout) ${fullSig} {// renderObjectOutmap for ${decl.name}\n
    v8::Local<v8::Object> obj = SWIGV8_OBJECT_NEW();
  ${assignArgs}
    $result = obj;
  }`;
}

function renderSingleValueOutmap(decl, fullSig) {
  var arg = decl.argouts[0];
  var value = swigConvert(arg.decl, '$1');
  if (decl.argouts.length > 1)
    throw new Error('single value outmap can only be used with single arg');
  return `%typemap(argout) ${fullSig} {// renderSingleValueOutmap for ${decl.name}\n
${value.statements || '\n'}\
   $result = ${value.expr};
  }`;
}

function renderArgoutInit(decl, fullSig){
  var argDef = [];
  var argInit = [];
  
  decl.argouts.forEach((arg, index) => {
    var nativeType = common.stripTypeQualifiers(arg.decl);
    var tm = features.getTypemap(nativeType);
    if(tm && tm.initArgout ){
      argInit.push(`$${index + 1} = ${tm.initArgout(decl)}`)
    } else {
      argDef.push(nativeType + ' argout' + (index + 1));
      argInit.push(`$${index + 1} = &argout${index + 1};`);
    }
  });
  
  argDef = argDef.length > 0 ? `(${argDef.join(', ')})` : '';
  console.log("argDef", argDef)
  argInit = argInit.join('\n  ');
  
  return `%typemap(in, numinputs=0) ${fullSig} ${argDef} {
  // renderArgoutInit for ${decl.name} 
  ${argInit}
}`;
}

function renderArgouts(decl) {
  if (!decl.argouts) return false;

  var sigArgs = decl.argouts
    .map(arg => `${arg.decl}${arg.name}_out`)
    .join(', ');
  var source = decl.source()
  var fullSignature = `${source.returnType} ${source.parent}::${source.name}(${sigArgs})`;
  fullSignature = `(${sigArgs})`;
  
  var defArgs = decl.argouts
    .map((arg, index) => 
      `${common.stripTypeQualifiers(arg.decl)} argout${index + 1}`
    )
    .join(', ');

  var tmpArgs = decl.argouts
    .map((arg, index) => `  $${index + 1} = &argout${index + 1};`)
    .join('\n');

  //var inMap = `%typemap(in, numinputs=0) (${sigArgs})  {\n// argoutin\n ${tmpArgs}\n}`;

  var outMap;
  if (decl.argouts.length === 1)
    outMap = renderSingleValueOutmap(decl, fullSignature);
  else if (decl.returnType === 'Array')
    outMap = renderArrayOutmap(decl, fullSignature);
  else
    outMap = renderObjectOutmap(decl, fullSignature);

  //var comment = `// typemap for ${decl.name}`;
  var inMap = renderArgoutInit(decl, fullSignature);
  return {
    name: 'typemaps.i',
    src: [inMap, outMap].join('\n')
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
    .map(arg => `\n    helpers.expectType(res.${camelCase(arg.name)}, '${arg.type}');`)
    .join('');

  return { name, src };
}
features.registerRenderer('spec', 40, renderArgoutExpectations);
