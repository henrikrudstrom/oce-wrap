const features = require('../features.js');

function typemapIndexedMap(native, wrapped, elemType) {
  return this.typemap(native, wrapped, {
    render: true,
    toNative: 'arrayToAppendable',
    toWrapped: 'indexableToArray',
    elemType,
    getSize: 'Extent',
    getElem: 'FindKey',
    addElem: 'Add'
  });
}

function typemapListOf(native, wrapped, elemType) {
  return this.typemap(native, wrapped, {
    render: true,
    toNative: 'arrayToAppendable',
    toWrapped: 'iterableToArray',
    elemType,
    getSize: 'Extent',
    addElem: 'Append'
  });
}

function typemapArray1Of(native, wrapped, elemType) {
  return this.typemap(native, wrapped, {
    render: true,
    toNative: 'arrayToSettable',
    toWrapped: 'indexableToArray',
    elemType,
    getSize: 'Length',
    getElem: 'Value',
    setElem: 'SetValue',
    initArgout: decl => `new ${native}(1,arg1->${decl.getParent().lengthProperty});`
  });
}

features.registerConfig(typemapIndexedMap, typemapListOf, typemapArray1Of);


// ----------------------------------------------------------------------------
// SWIG rendering
// ----------------------------------------------------------------------------

function swigValue(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIGV8_NUMBER_NEW(${arg})`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIGV8_BOOLEAN_NEW(${arg})`;
  if (type.indexOf('Standard_Integer') !== -1)
    return `SWIGV8_INTEGER_NEW(${arg})`;

  return `SWIG_NewPointerObj((${type}*)&(${arg}), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`;
}

function nativeValue(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIG_AsVal(double)(${arg}, &argpointer)`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIG_AsVal(bool)(${arg}, &argpointer)`;
  if (type.indexOf('Standard_Integer') !== -1)
    return `SWIG_AsVal(int)(${arg}, &argpointer)`; // not sure if SWIG_AsVal is always in the swig file
  return `SWIG_ConvertPtr(${arg}, (void **)&argpointer, SWIGTYPE_p_${type}, 0)`;
}


function indexableToArray(tm) {
  return (nativeObj, wrappedObj) =>
    `\
  v8::Local<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), ${nativeObj}->${tm.getSize}());
  for(int i = 1; i <= ${nativeObj}->${tm.getSize}(); i++){
    array->Set(i-1, ${swigValue(tm.elemType, nativeObj + '->' + tm.getElem + '(i)')});
  }
  ${wrappedObj} = array;`;
}

function isPrimitive(elemType){
  return elemType === 'Standard_Real' ||
    elemType === 'Standard_Integer' ||
    elemType === 'Standard_Boolean';
}

function arrayToAppendable(tm) {
  // TODO: not tested
  var deref = '*';
  if (isPrimitive(tm.elemType))
    deref = '';

  return (nativeObj, wrappedObj) =>
    `\
    v8::Handle<v8::Array> array = v8::Handle<v8::Array>::Cast(${wrappedObj});
    int length = obj->Get(SWIGV8_SYMBOL_NEW("length"))->ToObject()->Uint32Value();

    ${tm.native} * list = new ${tm.native}();
    ${tm.elemType} ${deref}argpointer;

    for(int i = 1; i <= length; i++){
      ${nativeValue(tm.elemType, 'array->Get(i-1)')};
      list->${tm.addElem}((const ${tm.elemType} &)${deref}argpointer);
    }

    ${nativeObj} = list;
`;
}

function arrayToSettable(tm) {
  var deref = '*';
  if (isPrimitive(tm.elemType))
    deref = '';

  return (nativeObj, wrappedObj) =>
    `\
    v8::Handle<v8::Array> array = v8::Handle<v8::Array>::Cast(${wrappedObj});
    int length = array->Get(SWIGV8_SYMBOL_NEW("length"))->ToObject()->Uint32Value();

    ${tm.native} * list = new ${tm.native}(1, length);
    ${tm.elemType} ${deref}argpointer;

    for(int i = 1; i <= length; i++){
      ${nativeValue(tm.elemType, 'array->Get(i-1)')};
      list->${tm.setElem}(i, (const ${tm.elemType} &)${deref}argpointer);
    }

    ${nativeObj} = list;
`;
}

function iterableToArray(tm) {
  var name = tm.native.split('_')[1];
  var mod = tm.native.split('_')[0];
  
  return (nativeObj, wrappedObj) =>
    `
  v8::Local<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), ${nativeObj}->${tm.getSize}());
 	${mod}_ListIteratorOf${name} iterator($1);
  int i = 0;
  while(iterator.More()) {
    array->Set(i, ${swigValue(tm.elemType, 'iterator->Value()')});
    iterator.Next();
    i++;
  }

  ${wrappedObj} = array;`;
}


features.registerWrappedConverter(indexableToArray);
features.registerWrappedConverter(iterableToArray);
features.registerNativeConverter(arrayToAppendable);
features.registerNativeConverter(arrayToSettable);
