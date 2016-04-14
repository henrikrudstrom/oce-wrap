/*

  Create a file with this name, 'javascriptfragments.swg', in your working
  directory and add all the %fragments you want to take precedence
  over the default ones defined by swig.

  For example, if you add:
  
  %fragment(SWIG_AsVal_frag(int),"header") {
   SWIGINTERNINLINE int
   SWIG_AsVal(int)(PyObject *obj, int *val)
   { 
     <your code here>;
   }
  }
  
  this will replace the code used to retrieve an integer value for all
  the typemaps that need it, including:
  
    int, std::vector<int>, std::list<std::pair<int,int> >, etc.

    
*/
%fragment("js_ctor", "templates") %{
static SwigV8ReturnValue $jswrapper(const SwigV8Arguments &args) {
  SWIGV8_HANDLESCOPE();
  //wohoo
  v8::Handle<v8::Object> self = args.Holder();
  $jslocals
  if(args.Length() != $jsargcount) SWIG_exception_fail(SWIG_ERROR, "Illegal number of arguments for $jswrapper.");
  $jscode

  SWIGV8_SetPrivateData(self, result, SWIGTYPE_$jsmangledtype, SWIG_POINTER_OWN);
  SWIGV8_RETURN(self);

  goto fail;
fail:
  SWIGV8_RETURN(SWIGV8_UNDEFINED());
}
%}

%fragment("js_overloaded_ctor", "templates") %{
static SwigV8ReturnValue $jswrapper(const SwigV8Arguments &args, V8ErrorHandler &SWIGV8_ErrorHandler) {
  SWIGV8_HANDLESCOPE();
  //wohoo
  v8::Handle<v8::Object> self = args.Holder();
  $jslocals
  if(args.Length() != $jsargcount) SWIG_exception_fail(SWIG_ERROR, "Illegal number of arguments for $jswrapper.");
  $jscode

  SWIGV8_SetPrivateData(self, result, SWIGTYPE_$jsmangledtype, SWIG_POINTER_OWN);
  SWIGV8_RETURN(self);

  goto fail;
fail:
  SWIGV8_RETURN(SWIGV8_UNDEFINED());
}
%}
