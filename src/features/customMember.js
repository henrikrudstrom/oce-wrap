const extend = require('extend');
const features = require('../features.js');
const headers = require('../headers.js');

function customMethod(decl) {
  this.pushMethod(8, () => {
    decl = extend({}, decl);

    decl.parent = this.name;
    decl.declType = 'memfun';
    decl.throws = true;
    decl.custom = true;

    this.add(decl);
    return this;
  });
}

function topoSubShapes(name, shapeType) {
  // makes sure this executes after renames (5)
  var src = headers.get(
    'TopExp::MapShapes(TopoDS_Shape, TopAbs_ShapeEnum, TopTools_IndexedMapOfShape)'
  );

  var decl = extend(true, {}, src);

  decl.arguments = [extend({}, decl.arguments[0])];
  decl.name = name;
  decl.shapeType = shapeType;
  decl.key = this.key + '::' + decl.key;
  decl.returnType = 'TopTools_IndexedMapOfShape';
  delete decl.static;
  return this.customMethod(decl);

}

features.registerConfig(customMethod, topoSubShapes);

function renderTopoMaps(decl) {
  return `\
%extend ${decl.getParent().origName} {
  static void ${decl.name}(const TopoDS_Shape &shape, TopTools_IndexedMapOfShape& map){
    TopExp::MapShapes(shape, TopAbs_${decl.shapeType}, map);
  }
}`;
}


function renderCustomMemberFunction(decl) {
  if (!decl.custom) return false;

  return {
    name: 'extends.i',
    src: renderTopoMaps(decl)
  };
}

features.registerRenderer('swig', 0, renderCustomMemberFunction);
