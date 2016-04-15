const camelCase = require('camel-case');
module.exports = function(mod) {
  mod.name = 'brepTest';
  mod.depends('gp');
  mod.include('BRepBuilderAPI_MakeFace');
  mod.include('TopoDS_Shape');
  mod.include('TopoDS_Face');
  mod.get('TopoDS_Shape').exclude('Free')
  mod.get('TopoDS_Shape').exclude('isNotEqual');
  //mod.include('gp_*');

  mod.find('*').include('*');
  mod.find('*').exclude('_*');




  mod.camelCase('*::*');
  mod.removePrefix('*');

};
