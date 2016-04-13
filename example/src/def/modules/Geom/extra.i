/*%typemap(in, numinputs=0) (Standard_Real &U1, Standard_Real &U2, Standard_Real &V1, Standard_Real &V2) (double t1, double t2, double t3, double t4) {
  //hello
   $1 = &t1;
   $2 = &t2;
   $3 = &t3;
   $4 = &t4;
}

%typemap(argout) (Standard_Real &U1, Standard_Real &U2, Standard_Real &V1, Standard_Real &V2) {
  //hello
     v8::Handle<v8::Array> array = v8::Array::New(v8::Isolate::GetCurrent(), 4);
     array->Set(0, SWIG_From_double(*$1));
     array->Set(1, SWIG_From_double(*$2));
     array->Set(2, SWIG_From_double(*$3));
     array->Set(3, SWIG_From_double(*$4));
     $result = array;
}*/




/*%extend Geom_Axis1Placement {
  //heyhey
  const Handle_Geom_Axis1Placement handle = 0;
  Handle_Geom_Axis1Placement Handle(){
    if($self->_handle == 0)
      $self->_handle = new Handle_Geom_Axis1Placement($self);
    return $self->_handle;
  }
}*/
/*
%typemap(in) Handle_Geom_Axis1Placement {
  // heyin1
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_Geom_Axis1Placement,  0 );
  $1 = new Handle_Geom_AxisPlacement((const Geom_Axis1Placement *)argp);
  
  //$1 = &((Handle_Geom_Axis1Placement *)(argp))->Handle();
}*/
/*
%typemap(in) Handle_Geom_AxisPlacement& {
  // heyin
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_Geom_AxisPlacement,  0 );
  $1 = new Handle_Geom_AxisPlacement((const Geom_AxisPlacement *)argp);
  //$1 = &((Handle_Geom_AxisPlacement *)(argp))->Handle();
}

%typemap(out) Handle_Geom_Geometry {
  // heyout
  //Geom_Geometry* tmp = ($1).Get();
  $result = SWIG_NewPointerObj($1, SWIGTYPE_p_Geom_Geometry, SWIG_POINTER_OWN |  0 );
}*/

/*
%{
 #include <Standard_Transient.hxx> 
 #include <Standard_Handle.hxx> 
 #include <Standard_DefineHandle.hxx>
%}
%template(Handle_Geom_Geometry) Handle<Geom_Geometry>;
%template(Handle_Geom_AxisPlacement) Handle<Geom_AxisPlacement>;
%template(Handle_Geom_Axis1Placement) Handle<Geom_Axis1Placement>;
*/