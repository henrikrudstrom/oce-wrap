const features = require('../features.js');

function typemapIndexedMap(native, wrapped, elemType) {
  return this.typemap(native, wrapped, {
    render: true,
    toNative: 'arrayToIndexable',
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
    toNative: 'arrayToIndexable',
    toWrapped: 'iterableToArray',
    elemType,
    getSize: 'Extent',
    addElem: 'Append'
  });
}

features.registerConfig(typemapIndexedMap, typemapListOf);

features.registerWrappedConverter(function indexableToArray(tm) {
  return (nativeObj, wrappedObj) =>
  `v8::Local<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), ${nativeObj}->${tm.getSize}());
  for(int i = 1; i <= ${nativeObj}->${tm.getSize}(); i++){
    std::cout << "index" << i << "buckets" << ${nativeObj}->${tm.getSize}();
    array->Set(i-1, SWIG_NewPointerObj((const ${tm.elemType}*)&(${nativeObj}->${tm.getElem}(i)), SWIGTYPE_p_${tm.elemType}, SWIG_POINTER_OWN |  0 ));
  }
  ${wrappedObj} = array;`;
});
features.registerNativeConverter(function arrayToIndexable(tm) {
  return (nativeObj, wrappedObj) =>
    `\
    ${tm.native} list();
    v8::Handle<v8::Array> array = v8::Handle<v8::Array>::Cast(${wrappedObj});
    int length = obj->Get(v8::String::New("length"))->ToObject()->Uint32Value();

    void *argpointer;
    for(int i = 1; i <= length; i++){
      SWIG_ConvertPtr(array->Get(i), &argpointer, SWIGTYPE_p_${tm.elemType}, 0);
      list.${tm.addElem}((const ${tm.elemType} &)argpointer);
    }

    ${nativeObj} = list;
`;
});

features.registerWrappedConverter(function iterableToArray(tm) {
  var name = tm.native.split('_')[1];
  var mod = tm.native.split('_')[0];
  return (nativeObj, wrappedObj) =>
    `
  v8::Local<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), ${nativeObj}->${tm.getSize}());
 	${mod}_ListIteratorOf${name} iterator($1);
  int i = 0;
  while(iterator.More()) {
    array->Set(i, SWIG_NewPointerObj((const ${tm.elemType}*)&(iterator->Value()), SWIGTYPE_p_${tm.elemType}, SWIG_POINTER_OWN |  0 ));
    iterator.Next();
    i++;
  }

  ${wrappedObj} = array;`
});
