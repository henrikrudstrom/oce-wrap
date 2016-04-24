const extend = require('extend');
const features = require('../features.js');
const headers = require('../headers.js');

function customMethod(decl) {
  decl = extend({}, decl);

  decl.parent = this.name;
  decl.cls = 'memfun';
  decl.throws = true;
  decl.custom = true;
  console.log(decl)

  this.add(decl);
  return this;
}

function topoSubShapes(name, shapeType) {
  // makes sure this executes after renames (5)
  this.pushMethod(6, () => {
    var src = headers.get(
      'TopExp::MapShapes(TopoDS_Shape, TopAbs_ShapeEnum, TopTools_IndexedMapOfShape)'
    );

    var decl = extend({}, src);

    decl.arguments = [extend({}, decl.arguments[0]), extend({}, decl.arguments[2])];
    decl.name = name;
    decl.shapeType = shapeType;
    decl.key = this.key + '::' + decl.key;
    delete decl.static;
    this.getParent().typemaps.push({ from: 'TopTools_IndexedMapOfShape', to: 'Array' });
    return this.customMethod(decl);
  });
}

features.registerConfig(customMethod, topoSubShapes);

function renderTopoMaps(decl) {
  return `\
%extend ${decl.source().parent} {
  static void ${decl.name}(const TopoDS_Shape &shape, TopTools_IndexedMapOfShape &map){
    TopExp::MapShapes(shape, TopAbs_${decl.shapeType}, map);
  }
}`;
}


function renderCustomMemberFunction(decl) {
  // if (decl.cls !== 'memfun' || !decl.custom) return false;
  if (!decl.custom) return false;

  return {
    name: 'extends.i',
    src: renderTopoMaps(decl)
  };
}

features.registerRenderer('swig', 0, renderCustomMemberFunction);
