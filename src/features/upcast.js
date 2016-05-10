const features = require('../features.js');

// Upcast all TopoDS_Shape to the actual subtype, using ->ShapeType();

features.registerConfig(function upcast(baseclass, template) {
  this.typemap(baseclass, baseclass, template);
});


features.registerRenderer('swig', 7, function(decl) {
  if (!decl.typemaps || decl.typemaps.length < 1) return false;

  var typemap = decl.typemaps.find(tm => tm.renderer === 'upcastTopoDS');
  if (!typemap) return false;

  return {
    name: 'typemaps.i',
    src: `
%{
#include<TopoDS.hxx>
#include<TopoDS_Vertex.hxx>
#include<TopoDS_Edge.hxx>
#include<TopoDS_Wire.hxx>
#include<TopoDS_Face.hxx>
#include<TopoDS_Shell.hxx>
#include<TopoDS_Solid.hxx>
#include<TopoDS_CompSolid.hxx>
#include<TopoDS_Compound.hxx>
v8::Handle<v8::Value> upcastTopoDS_Shape(const TopoDS_Shape & shape){
  // lookup type
  int type = shape.ShapeType();
  switch(type){
    case 7:
      return SWIG_NewPointerObj(new TopoDS_Vertex(TopoDS::Vertex(shape)), SWIGTYPE_p_TopoDS_Vertex, SWIG_POINTER_OWN |  0);
    case 6:
      return SWIG_NewPointerObj(new TopoDS_Edge(TopoDS::Edge(shape)), SWIGTYPE_p_TopoDS_Edge, SWIG_POINTER_OWN |  0);
    case 5:
      return SWIG_NewPointerObj(new TopoDS_Wire(TopoDS::Wire(shape)), SWIGTYPE_p_TopoDS_Wire, SWIG_POINTER_OWN |  0);
    case 4:
      return SWIG_NewPointerObj(new TopoDS_Face(TopoDS::Face(shape)), SWIGTYPE_p_TopoDS_Face, SWIG_POINTER_OWN |  0);
    case 3:
      return SWIG_NewPointerObj(new TopoDS_Shell(TopoDS::Shell(shape)), SWIGTYPE_p_TopoDS_Shell, SWIG_POINTER_OWN |  0);
    case 2:
      return SWIG_NewPointerObj(new TopoDS_Solid(TopoDS::Solid(shape)), SWIGTYPE_p_TopoDS_Solid, SWIG_POINTER_OWN |  0);
    case 1:
      return SWIG_NewPointerObj(new TopoDS_CompSolid(TopoDS::CompSolid(shape)), SWIGTYPE_p_TopoDS_CompSolid, SWIG_POINTER_OWN |  0);
    case 0:
      return SWIG_NewPointerObj(new TopoDS_Compound(TopoDS::Compound(shape)), SWIGTYPE_p_TopoDS_Compound, SWIG_POINTER_OWN |  0);
  }
  SWIG_V8_Raise("Could not upcast shape, dynamicType: " + type);
  return SWIGV8_UNDEFINED();
}
v8::Handle<v8::Value> upcastTopo2DS_Shape(const TopoDS_Shape & shape){
    // lookup type
    int type = shape.ShapeType();
    std::string typeName = "";
    void * voidptr = 0;
    switch(type){
      case 7:
        typeName = "TopoDS_Vertex";
        voidptr = SWIG_as_voidptr(new TopoDS_Vertex(TopoDS::Vertex(shape)));
        break;
      case 6:
        typeName = "TopoDS_Edge";
        voidptr = SWIG_as_voidptr(new TopoDS_Edge(TopoDS::Edge(shape)));
        break;
      case 5:
        typeName = "TopoDS_Wire";
        voidptr = SWIG_as_voidptr(new TopoDS_Wire(TopoDS::Wire(shape)));
        break;
      case 4:
        typeName = "TopoDS_Face";
        voidptr = SWIG_as_voidptr(new TopoDS_Face(TopoDS::Face(shape)));
        break;
      case 3:
        typeName = "TopoDS_Shell";
        voidptr = SWIG_as_voidptr(new TopoDS_Shell(TopoDS::Shell(shape)));
        break;
      case 2:
        typeName = "TopoDS_Solid";
        voidptr = SWIG_as_voidptr(new TopoDS_Solid(TopoDS::Solid(shape)));
        break;
      case 1:
        typeName = "TopoDS_CompSolid";
        voidptr = SWIG_as_voidptr(new TopoDS_CompSolid(TopoDS::CompSolid(shape)));
        break;
      case 0:
        typeName = "TopoDS_Compound";
        voidptr = SWIG_as_voidptr(new TopoDS_Compound(TopoDS::Compound(shape)));
        break;
    }
    std::cout << "got name " << typeName << std::endl;
    swig_type_info * const outtype = SWIG_TypeQuery((typeName + " *").c_str());
    std::cout << "info " << typeName << std::endl;
    return SWIG_NewPointerObj(voidptr, outtype, SWIG_POINTER_OWN |  0);
  }
%}`
  };
});

features.registerTypemapRenderer('upcastTopoDS', function() {
  return {
    toWrapped(input, output, byval) {
      var res = '';
      if (byval) {
        res = `const TopoDS_Shape & shapeRef = ${input};\n`;
        input = 'shapeRef';
      }
      return `      ${res}
      ${output} = upcastTopoDS_Shape(${input});`;
    }
  };
});
