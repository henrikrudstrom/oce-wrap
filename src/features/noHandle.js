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
  int res = SWIG_ConvertPtr($input, &argpointer, SWIGTYPE_p_${name},  0 );
  $1 = new Handle_${name}((const ${name} *)argpointer);
  $input->ToObject()->Set(SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewPointerObj($1, SWIGTYPE_p_Handle_${name}, SWIG_POINTER_OWN |  0 ));
}

%typemap(out) Handle_${name} {
  // handleout
  $result = SWIG_NewPointerObj($1.Access(), SWIGTYPE_p_${name}, SWIG_POINTER_OWN |  0 );
  $result->ToObject()->Set(SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewPointerObj(&$1, SWIGTYPE_p_Handle_${name}, SWIG_POINTER_OWN |  0 ));
}`;

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
%extend ${name} {
  Handle_${name}* getHandle(){
    return new Handle_${name};
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
