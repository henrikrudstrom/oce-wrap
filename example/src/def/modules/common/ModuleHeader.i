#pragma SWIG nowarn=504,325,503

%{
#ifdef WNT
#pragma warning(disable : 4716)
#endif
%}
%include CommonIncludes.i
%include ExceptionCatcher.i
/*%include ../common/FunctionTransformers.i*/
%include Operators.i
