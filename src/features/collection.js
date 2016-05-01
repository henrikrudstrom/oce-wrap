const features = require('../features.js');


// ----------------------------------------------------------------------------
// configuration functions
// ----------------------------------------------------------------------------

function typemapIndexedMap(collectionMod, elemType) {
  var listType = collectionMod + '_IndexedMapOf' + elemType.split('_')[1];
  return this.typemap(listType, 'Array', 'indexedMap', { elemType });
}

function typemapList(collectionMod, elemType) {
  var listType = collectionMod + '_ListOf' + elemType.split('_')[1];
  return this.typemap(listType, 'Array', 'list', { elemType });
}

function typemapArray1(collectionMod, elemType) {
  var listType = collectionMod + '_Array1Of' + elemType.split('_')[1];
  return this.typemap(listType, 'Array', 'array1', { elemType });
}

features.registerConfig(typemapIndexedMap, typemapList, typemapArray1);


// ----------------------------------------------------------------------------
// SWIG rendering
// ----------------------------------------------------------------------------

function isPrimitive(elemType) {
  return elemType === 'Standard_Real' ||
    elemType === 'Standard_Integer' ||
    elemType === 'Standard_Boolean';
}

function swigValue(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIGV8_NUMBER_NEW(${arg})`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIGV8_BOOLEAN_NEW(${arg})`;
  if (type.indexOf('Standard_Integer') !== -1)
    return `SWIGV8_INTEGER_NEW(${arg})`;

  return `SWIG_NewPointerObj((${type}*)(${arg}), SWIGTYPE_p_${type}, SWIG_POINTER_OWN |  0 )`;
}

function nativeValue(type, arg) {
  if (type.indexOf('Standard_Real') !== -1)
    return `SWIG_AsVal(double)(${arg}, &argpointer)`;
  if (type.indexOf('Standard_Boolean') !== -1)
    return `SWIG_AsVal(bool)(${arg}, &argpointer)`;
  if (type.indexOf('Standard_Integer') !== -1)
    // not sure if SWIG_AsVal is always in the swig file
    return `SWIG_AsVal(int)(${arg}, &argpointer)`;

  return `SWIG_ConvertPtr(${arg}, (void **)&argpointer, SWIGTYPE_p_${type}, 0)`;
}


// ----------------------------------------------------------------------------
// array to native collection helpers
// ----------------------------------------------------------------------------

function arrayToNative(input, output, content) {
  return `\
    v8::Handle<v8::Array> array = v8::Handle<v8::Array>::Cast(${input});
    int length = array->Get(SWIGV8_SYMBOL_NEW("length"))->ToObject()->Uint32Value();

    ${content}

    ${output} = list;`;
}

function arrayToSettable(listType, elemType, setter) {
  var deref = isPrimitive(elemType) ? '' : '*';
  return `\
    ${listType} * list = new ${listType}(1, length);
    ${elemType} ${deref}argpointer;

    for(int i = 1; i <= length; i++){
      ${nativeValue(elemType, 'array->Get(i-1)')};
      list->${setter}(i, (const ${elemType} &)${deref}argpointer);
    }`;
}

function arrayToAppendable(listType, elemType, add) {
  var deref = isPrimitive(elemType) ? '' : '*';
  return `\
    ${listType} * list = new ${listType}(1, length);
    ${elemType} ${deref}argpointer;

    for(int i = 1; i <= length; i++){
      ${nativeValue(elemType, 'array->Get(i-1)')};
      list->${add}((const ${elemType} &)${deref}argpointer);
    }`;
}


// ----------------------------------------------------------------------------
// Native collections to array helpers
// -------------------------------------------------------------------------

function nativeToArray(input, output, getSize, content) {
  return `\
    v8::Local<v8::Array> array = v8::Array::New(
      v8::Isolate::GetCurrent(), ${input}->${getSize}());
    int length = ${input}->${getSize}();
    ${content}
    ${output} = array;
    `;
}

function assignSettable(input, elemType, getExpr) {
  if (isPrimitive(elemType)) {
    return `array->Set(i-1, ${swigValue(elemType, getExpr)});`;
  }
  return `\
    ${elemType} * val = new ${elemType}(${getExpr});
    array->Set(i-1, ${swigValue(elemType, 'val')});`;
}

function iterableToArray(input, listType, elemType) {
  var name = listType.split('_')[1];
  var mod = listType.split('_')[0];
  var assign = assignSettable(input, elemType, '&iterator->Value()');
  return `\
   	${mod}_ListIteratorOf${name} iterator($1);
    int i = 0;
    while(iterator.More()) {
      ${assign}
      iterator.Next();
      i++;
    }`;
}

function indexableToArray(input, elemType, getter) {
  var assign = assignSettable(input, elemType, input + '->' + getter + '(i)');
  return `\
    for(int i = 1; i <= length; i++){
      ${assign}
    }`;
}


features.registerTypemapRenderer('array1', function array1Typemap(tm) {
  return {
    toNative(input, output) {
      return arrayToNative(input, output,
        arrayToSettable(tm.native, tm.elemType, 'SetValue')
      );
    },

    toWrapped(input, output) {
      return nativeToArray(input, output, 'Length',
        indexableToArray(input, tm.elemType, 'Value')
      );
    },

    initArgout(decl) {
      return `new ${tm.native}(1,arg1->${decl.getParent().lengthProperty});`;
    },
    freearg(arg) {
      return `${arg}->Destroy();`;
    }
  };
});

features.registerTypemapRenderer('list', function listTypemap(tm) {
  return {
    toNative(input, output) {
      return arrayToNative(input, output,
        arrayToAppendable(tm.native, tm.elemType, 'Append')
      );
    },

    toWrapped(input, output) {
      return nativeToArray(input, output, 'Extent',
        iterableToArray(input, tm.native, tm.elemType)
      );
    }
  };
});

features.registerTypemapRenderer('indexedMap', function indexedMapTypemap(tm) {
  return {
    toNative(input, output) {
      return arrayToNative(input, output,
        arrayToAppendable(tm.native, tm.elemType, 'Add')
      );
    },

    toWrapped(input, output) {
      return nativeToArray(input, output, 'Extent',
        indexableToArray(input, tm.elemType, 'FindKey')
      );
    }
  };
});
