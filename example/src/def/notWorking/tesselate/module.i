/*
##Copyright 2008-2014 Thomas Paviot (tpaviot@gmail.com)
##
##This file is part of pythonOCC.
##
##pythonOCC is free software: you can redistribute it and/or modify
##it under the terms of the GNU Lesser General Public License as published by
##the Free Software Foundation, either version 3 of the License, or
##(at your option) any later version.
##
##pythonOCC is distributed in the hope that it will be useful,
##but WITHOUT ANY WARRANTY; without even the implied warranty of
##MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
##GNU General Public License for more details.
##
##You should have received a copy of the GNU Lesser General Public License
##along with pythonOCC.  If not, see <http://www.gnu.org/licenses/>.
*/
%module Tesselator;

%{
#include <Tesselator.h>
#include <Standard.hxx>
%}

%include ../common/ModuleHeader.i
//%include "python/std_string.i"
%include "typemaps.i"


%typemap(out) float [ANY] {
  Isolate* isolate = args.GetIsolate();
  $result = Array::New(isolate);

  int i;
  for (i = 0; i < $1_dim0; i++) {
    Number::New(isolate, $1[i]);
    $result->->Set(i, result);
  }
}

enum theTextureMappingRule {
	atCube,
	atNormal,
	atNormalAutoScale
	};

/*%apply int& OUTPUT {int& v1, int& v2, int& v3}
%apply float& OUTPUT {float& x, float& y, float& z}*/

class Tesselator {
 public:
    /*Tesselator(TopoDS_Shape aShape,
               float aDeviation,
               theTextureMappingRule aTxtMapType,
               float anAutoScaleSizeOnU,
               float anAutoScaleSizeOnV,
               float aUOrigin,
               float aVOrigin,
               float aURepeat,
               float aVRepeat,
               float aScaleU,
               float aScaleV,
               float aRotationAngle);*/
    Tesselator(TopoDS_Shape aShape,
               float aDeviation);
    std::string exportJSON();
    //Tesselator(TopoDS_Shape aShape);
    /*void GetVertex(int ivert, float& x, float& y, float& z);
    void GetNormal(int inorm, float& x, float& y, float& z);
    void GetTriangleIndex(int triangleIdx, int& v1, int& v2, int& v3);
    void GetEdgeVertex(int iEdge, int ivert, float& x, float& y, float& z);
	float* VerticesList();
	int ObjGetTriangleCount();
	int ObjGetVertexCount();
	int ObjGetNormalCount();
	int ObjGetEdgeCount();
	int ObjEdgeGetVertexCount(int iEdge);
    std::string ExportShapeToX3DIndexedFaceSet();
	void ExportShapeToThreejs(char *filename);
	void ExportShapeToX3D(char *filename, int diffR=1, int diffG=0, int diffB=0);
	void SetDeviation(float aDeviation);*/
};
