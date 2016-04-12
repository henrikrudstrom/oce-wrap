
//in progress
%typemap(in) gp_XYZ {
  $1 = $input->XYZ();
}
%typemap(out) gp_XYZ {
  $result = SWIG_NewPointerObj((new gp_Vec((const gp_Vec&)$1)), SWIGTYPE_p_gp_Vec, SWIG_POINTER_OWN |  0 );
}
