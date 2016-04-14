var conf = require('../conf.js');

conf.Conf.prototype.noHandle = function(expr){
  this.transform(expr, (obj) => {
    this.include('Handle_'+obj.key);
    this.typemap('Handle_'+obj.key, obj.key);
    obj.handle = true;
  });
}

conf.MultiConf.prototype.noHandle = function noHandle(expr, newName) {
  this.map((decl) => decl.noHandle(expr, newName));
  return this;
};

module.exports.renderSwig = function(cls){
  if(cls.cls !== 'class' || !cls.handle)
    return false;
   var src = `
%typemap(in) Handle_${cls.name}& {
  void *argpointer ;
  int res = SWIG_ConvertPtr($input, &argpointer, SWIGTYPE_p_${cls.name},  0 );
  $1 = new Handle_${cls.name}((const ${cls.name} *)argp);
}

%typemap(out) Handle_${cls.name} {
  $result = SWIG_NewPointerObj($1, SWIGTYPE_p_${cls.name}, SWIG_POINTER_OWN |  0 );
  $result->ToObject()->Set(SWIGV8_SYMBOL_NEW("_handle"), SWIG_NewPointerObj(&$1, SWIGTYPE_p_Handle_${cls.name}, SWIG_POINTER_OWN |  0 ));
}`;
  return { name: 'typemaps.i', src };
  
}
