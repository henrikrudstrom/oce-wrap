%module(package="OCC") handle
%include ../common/ModuleHeader.i
%include "headers.i"
//%include "properties.i"
// no typemaps

class Standard_Transient {};
class MMgt_TShared : public Standard_Transient {};
class Handle_Standard_Transient {};
class Handle_MMgt_TShared : public Handle_Standard_Transient {};
%include classes/Geom_Geometry.i
%include classes/Geom_AxisPlacement.i
%include classes/Geom_Axis1Placement.i
