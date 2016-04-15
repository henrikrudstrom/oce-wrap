var conf = require('../conf.js');

conf.Conf.prototype.noHandle = function(expr) {
  console.log(expr)
  this.find(expr).forEach(cls => {
    if (cls.key.startsWith('Handle_')) return;
    this.include('Handle_' + cls.name);
    this.get('Handle_' + cls.name).include('Handle_' + cls.name + '(*)');

  })
  this.transform(expr, (obj) => {
    if (obj.key.startsWith('Handle_')) return;
    this.typemap('Handle_' + obj.key, obj.key);
    obj.handle = true;
  });
}

conf.MultiConf.prototype.noHandle = function noHandle(expr, newName) {
  this.map((decl) => decl.noHandle(expr, newName));
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
  //std::cout << "stand by..." << std::endl;
  int res = SWIG_ConvertPtr($input->ToObject()->Get(SWIGV8_SYMBOL_NEW("_handle")), &argpointer, SWIGTYPE_p_Handle_${name}, 0);
  //std::cout << "result: " << res << std::endl;
  //$1 = (Handle_${name} *)(argpointer);
  $1 = (Handle_${name} *)new Handle_${name}(argpointer);
}

%typemap(out) Handle_${name} {
  // lookup type
  std::string name($1->DynamicType()->Name());
  const std::string lookup_typename = name + " *";
  swig_type_info * const outtype = SWIG_TypeQuery(lookup_typename.c_str());
  $result = SWIG_NewPointerObj(SWIG_as_voidptr($1), outtype, $owner);
  // attach handle
  Handle_${name} *handle = (Handle_${name} *)new Handle_${name}($1);
  $result->ToObject()->Set(SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewFunctionPtrObj(handle, SWIGTYPE_p_Handle_${name}));
}`
;


  // %nodefaultctor Handle_${name};
  var handlessrc = `
class Handle_${name} : public Handle_${cls.source().bases[0].name} {
public:
  Handle_${name}(const ${name} *anItem);

};
`
  var extendssrc = `
%extend Handle_${name} {
  ${name}* getObject(){
    return (${name}*)self->Access();
  }
}
`

  return [
    //{ name: 'handles', src: handlessrc },
    { name: 'extends', src: extendssrc },
    { name: 'typemaps.i', src: typemapsrc }
  ];
  //return { name: 'handles.i', handlessrc };
}
