var conf = require('../conf.js');
var headers = require('../headers.js');

conf.Conf.prototype.noHandle = function(expr) {
  this.find(expr).forEach(cls => {
    if (cls.key.startsWith('Handle_')) return;

    var handleKey = 'Handle_' + cls.name;
    if (!headers.get(handleKey)) return;

    this.include(handleKey);
    var handle = this.get('Handle_' + cls.name);

    if (handle)
      handle.include('Handle_' + cls.name + '(*)');
  });
  this.transform(expr, (obj) => {
    if (obj.key.startsWith('Handle_')) return;

    this.typemap('Handle_' + obj.key, obj.key);
    obj.handle = true;
  });
};

conf.Conf.prototype.downCastToThis = function(expr) {
  this.find(expr).forEach(mem => {
    mem.downCastToThis = true;
  });
};

conf.MultiConf.prototype.noHandle = function noHandle(expr, newName) {
  this.map((decl) => decl.noHandle(expr, newName));
  return this;
};
conf.MultiConf.prototype.downCastToThis = function downCastToThis(expr, newName) {
  this.map((decl) => decl.downCastToThis(expr, newName));
  return this;
};

module.exports.renderSwig = function(cls) {
  var name = cls.key;
  if (cls.cls !== 'class' || !cls.handle)
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
};
