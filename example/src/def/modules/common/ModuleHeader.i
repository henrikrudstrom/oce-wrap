#pragma SWIG nowarn=504,325,503

%{
#ifdef WNT
#pragma warning(disable : 4716)
#endif
#include <Standard_Transient.hxx>
#include <MMgt_TShared.hxx>
#include <Handle_Standard_Transient.hxx>
#include <Handle_MMgt_TShared.hxx>
%}
%include CommonIncludes.i
%include ExceptionCatcher.i
/*%include ../common/FunctionTransformers.i*/
%include Operators.i
%include javascriptfragments.swg
/*class Standard_Transient {}
class MMgt_TShared : public Standard_Transient {}
class Handle_Standard_Transient {}
class Handle_MMgt_TShared : public Handle_Standard_Transient {}*/
