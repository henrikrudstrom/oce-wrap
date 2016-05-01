const features = require('../features.js');
const headers = require('../headers.js');

// Attaches handle to javascript proxy to prevent garbage collection
// Typemaps all functions to accept/return the handled type instead of the handle.
// TODO: implement as proper typemap

function noHandle(expr) {
  this.find(expr).forEach(cls => {
    if (cls.key.startsWith('Handle_')) return;

    var handleKey = 'Handle_' + cls.name;
    if (!headers.get(handleKey)) return;

    this.include(handleKey);

    var handle = this.get('Handle_' + cls.name);

    if (handle)
      handle.include('Handle_' + cls.name + '(*)');
  });

  this.pushQuery(5, expr, (obj) => {
    if (obj.key.startsWith('Handle_')) return;

    this.typemap('Handle_' + obj.key, obj.key);
    obj.handle = true;
  });
}

// specify that the return type of this method will be the same
// as the class, (for inherited methods etc)
function downCastToThis(expr) {
  this.find(expr).forEach(mem => {
    mem.downCastToThis = true;
  });
}

features.registerConfig(noHandle, downCastToThis);


function renderHandleTypemaps(cls) {
  var name = cls.key;
  if (cls.declType !== 'class' || !cls.handle)
    return false;

  var typemapsrc = `
%typemap(in) Handle_${name}& {
  // handlein
  void *argpointer ;
  int res = SWIG_ConvertPtr($input->ToObject()->Get(SWIGV8_SYMBOL_NEW("_handle")), &argpointer, SWIGTYPE_p_Handle_Standard_Transient, 0);
  if (!SWIG_IsOK(res)) {
    SWIG_exception_fail(SWIG_ArgError(res), "in method '" "$symname" "', argument " "$argnum"" of type '" "${name}""'");
  }
  $1 = (Handle_${name} *)(argpointer);
}

%typemap(out) Handle_${name} {
  // lookup type
  std::string name($1->DynamicType()->Name());
  const std::string lookup_typename = name + " *";
  swig_type_info * const outtype = SWIG_TypeQuery(lookup_typename.c_str());
  $result = SWIG_NewPointerObj(SWIG_as_voidptr($1), outtype, $owner);

  // attach handle
  Handle_${name} *handle = (Handle_${name} *)new Handle_${name}($1);
  $result->ToObject()->Set(SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewFunctionPtrObj(handle, SWIGTYPE_p_Handle_Standard_Transient));
}`;

  return { name: 'typemaps.i', src: typemapsrc };
}

features.registerRenderer('swig', 0, renderHandleTypemaps);
