const camelCase = require('camel-case');
const features = require('../features.js');
const common = require('../common.js');

function isOutArg(arg) {
  return arg.decl.indexOf('&') !== -1 &&
    arg.decl.indexOf('const') === -1;
}

function argoutName(name) {
  if (name.indexOf('the') !== -1 && name.length > 3)
    name = name.replace('the', '');
  return name;
}


// ----------------------------------------------------------------------------
// Config functions
// ----------------------------------------------------------------------------

function defineArgout(mem, type) {
  var argoutIndices = mem.origArguments.map((a, index) => index)
    .filter(index => isOutArg(mem.origArguments[index]));

  if (argoutIndices.length < 1) return false;

  argoutIndices
    .forEach(index => {
      mem.origArguments[index].name = argoutName(mem.origArguments[index].name) + '_out';
      mem.origArguments[index].outArg = true;
      mem.arguments[index].outArg = true;
      mem.arguments[index].name = argoutName(mem.arguments[index].name);
    });

  if (argoutIndices.length > 1)
    mem.returnType = type;
  else
    mem.returnType = mem.arguments[argoutIndices[0]].type;

  return true;
}

function argout(expr, type) {
  if (type === undefined)
    throw new Error('argout type must be specified');

  this.pushQuery(9, expr, (mem) => {
    defineArgout(mem, type);
    return true;
  });
}

function argoutObject(expr) {
  return this.argout(expr, 'Object');
}

function defaultArgouts() {
  this.pushMethod(9, () => {
    this.declarations.forEach(decl => {
      if (!decl.arguments) return;

      var outarg = decl.arguments.some(isOutArg);

      if (!outarg) return;

      defineArgout(decl, 'Object');
    });
  });
}

features.registerConfig(argout, defaultArgouts, /* argoutArray,*/ argoutObject);


// ----------------------------------------------------------------------------
// Render swig
// ----------------------------------------------------------------------------

// generate code to convert variable `arg` to wrapped `type`
function swigConvert(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return { expr: `SWIGV8_NUMBER_NEW(*${arg})` };
  if (type.indexOf('Standard_Boolean') !== -1)
    return { expr: `SWIGV8_BOOLEAN_NEW(*${arg})` };
  if (type.indexOf('Standard_Integer') !== -1)
    return { expr: `SWIGV8_INTEGER_NEW(*${arg})` };

  var typemap = features.getTypemap(type);
  var render = features.getTypemapRenderer(typemap);

  if (!render) {
    // create default swig pointer with copy constructor
    var castedArg = `(new ${type}((const ${type})*${arg})`;
    return {
      expr: `SWIG_NewPointerObj(${castedArg}), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`
    };
  }
  return {
    // use typemap convertion template
    expr: 'value',
    statements: 'v8::Handle<v8::Value> value;\n  ' + render.toWrapped(arg, 'value', '$1') + '\n'
  };
}

// make object property names pretty
function processOutArgName(name) {
  name = name.replace('_out', '');
  return camelCase(name);
}


function renderObjectOutmap(decl, fullSig) {
  var assignArgs = decl.origArguments.filter(arg => arg.outArg)
    .map((arg, index) => {
      var key = `SWIGV8_STRING_NEW("${processOutArgName(arg.name)}")`;
      var value = swigConvert(arg.type, '$' + (index + 1));

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
  var argouts = decl.origArguments.filter(arg => arg.outArg);

  if (argouts.length > 1)
    throw new Error('single value outmap can only be used with single arg');

  var value = swigConvert(argouts[0].type, '$1');

  return `%typemap(argout) ${fullSig} {// renderSingleValueOutmap for ${decl.name}\n
${value.statements || '\n'}\
   $result = ${value.expr};
  }`;
}

function renderArgoutInit(decl, fullSig) {
  var argDef = [];
  var argInit = [];
  var argouts = decl.origArguments.filter(arg => arg.outArg);

  argouts.forEach((arg, index) => {
    var nativeType = common.stripTypeQualifiers(arg.decl);
    var tm = features.getTypemap(nativeType);
    var render = features.getTypemapRenderer(tm);
    if (render && render.initArgout) {
      argInit.push(`$${index + 1} = ${render.initArgout(decl)}`);
    } else {
      argDef.push(nativeType + ' argout' + (index + 1));
      argInit.push(`$${index + 1} = &argout${index + 1};`);
    }
  });

  argDef = argDef.length > 0 ? `(${argDef.join(', ')})` : '';

  argInit = argInit.join('\n  ');

  return `%typemap(in, numinputs=0) ${fullSig} ${argDef} {
  // renderArgoutInit for ${decl.name}
  ${argInit}
}`;
}

// main render function
function renderArgouts(decl) {
  if (!decl.arguments)
    return false;

  var argouts = decl.origArguments.filter(arg => arg.outArg);
  if (argouts.length < 1)
    return false;

  var sigArgs = argouts
    .map(arg => `${arg.decl}${arg.name}`)
    .join(', ');

  var fullSignature =
    `${decl.origReturnType} ${decl.getParent().origName}::${decl.origName}(${sigArgs})`;
  fullSignature = `(${sigArgs})`;

  var outMap;
  if (argouts.length === 1)
    outMap = renderSingleValueOutmap(decl, fullSignature);
  else
    outMap = renderObjectOutmap(decl, fullSignature);

  var inMap = renderArgoutInit(decl, fullSignature);

  var freeargs = argouts.map((arg, index) => {
    var typemap = features.getTypemap(arg.type);
    var render = features.getTypemapRenderer(typemap);
    if (!render || !render.freearg)
      return null;

    return render.freearg('$' + (index + 1));
  })
  .filter(freearg => freearg !== null);

  var freeargsMap = '';
  if (freeargs.length > 0) {
    freeargsMap = `\n%typemap(newfree) (${sigArgs}) {\n ${freeargs.join('\n  ')}\n}`;
  }

  return {
    name: 'typemaps.i',
    src: [inMap, outMap].join('\n') + freeargsMap
  };
}

features.registerRenderer('swig', 0, renderArgouts);


// ----------------------------------------------------------------------------
// Render test Expectations
// ----------------------------------------------------------------------------

function renderArgoutExpectations(decl) {
  if (!decl.arguments)
    return false;

  var argouts = decl.arguments.filter(arg => arg.outArg);

  // only add to tests with multiple argouts
  if (argouts.length < 2)
    return false;

  var name = decl.parent + '.' + common.signature(decl) + 'Expectations';

  var src = argouts
    .map(arg => `\n    helpers.expectType(res.${camelCase(arg.name)}, '${arg.type}');`)
    .join('');

  return { name, src };
}
features.registerRenderer('spec', 40, renderArgoutExpectations);
