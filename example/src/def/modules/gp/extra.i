
//in progress
%typemap(in) gp_XYZ &{
  // hello
  void *argp ;
  int res = SWIG_ConvertPtr($input, &argp, SWIGTYPE_p_gp_Vec,  0 );
  $1 = &(((gp_Vec *)(argp))->XYZ());
}
%typemap(out) gp_XYZ {
  // outhello
  $result = SWIG_NewPointerObj((new gp_Vec((const gp_Vec&)$1)), SWIGTYPE_p_gp_Vec, SWIG_POINTER_OWN |  0 );
}
  /*void *argp1 ;
res3 = SWIG_ConvertPtr(args[1], &argp3, SWIGTYPE_p_double,  0 );*/
