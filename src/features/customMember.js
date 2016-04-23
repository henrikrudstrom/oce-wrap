const extend = require('extend');
const conf = require('../conf.js');
const headers = require('../headers.js');
module.exports.name = 'customMember';
conf.Conf.prototype.customMethod = function customMethod(decl) {
  decl = extend({}, decl);

  decl.parent = this.name;
  decl.cls = 'memfun';
  decl.throws = true;
  decl.custom = true;

  this.add(decl);
  return this;
};

conf.Conf.prototype.topoSubShapes = function topoSubShapes(name, shapeType) {
  var src = headers.get(
    'TopExp::MapShapes(TopoDS_Shape, TopAbs_ShapeEnum, TopTools_IndexedMapOfShape)'
  );

  var decl = extend({}, src);

  decl.arguments = [decl.arguments[0], decl.arguments[2]];
  decl.name = name;
  decl.shapeType = shapeType;
  decl.key = this.key + '::' + decl.key;

  return this.customMethod(decl);
};

conf.MultiConf.prototype.topoSubShapes = function(name, shapeType) {
  this.map((decl) => decl.topoSubShapes(name, shapeType));
  return this;
};

function renderTopoMaps(decl) {
  return `\
%extend ${decl.source().parent} {
  static void ${decl.name}(TopoDS_Shape &shape, TopTools_IndexedMapOfShape &map){
    TopExp::MapShapes(shape, TopAbs_${decl.shapeType}, map);
  }
}`;
}

module.exports.renderSwig = function(decl) {
  if (decl.cls !== 'memfun' || !decl.custom) return false;

  return {
    name: 'extends.i',
    src: renderTopoMaps(decl)
  };
};
