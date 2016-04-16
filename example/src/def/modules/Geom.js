const camelCase = require('camel-case');
module.exports = function(mod) {
  mod.name = 'Geom';
  mod.depends('gp');
  mod.camelCase('*::*');
  mod.removePrefix('*');
  // mod.include('Standard_Type');
  // mod.include('Handle_Standard_Type');
  mod.include('Geom_Geometry');
  mod.include('Geom_Surface');
  mod.include('Geom_ElementarySurface');
  mod.include('Geom_SphericalSurface');
  mod.include('Geom_CylindricalSurface');
  mod.include('Geom_AxisPlacement');
  mod.include('Geom_Curve');
  mod.include('Geom_BoundedCurve');
  mod.include('Geom_BezierCurve');
  //mod.include('TColgp_Array1OfPnt');


  mod.find('*').include('*');
  mod.find('*')
    .argout('Bounds')
    .argout('TransformParameters')
    .argout('Coefficients');
  mod.noHandle('*');
  mod.find('*').downCastToThis('Scaled');
  mod.find('*').downCastToThis('Transformed');
  mod.find('*').downCastToThis('Translated');
  mod.find('*').downCastToThis('Rotated');
  mod.find('*').downCastToThis('Mirrored');
  mod.find('*').downCastToThis('Copy');
  mod.find('*').downCastToThis('UReversed');
  mod.find('*').downCastToThis('VReversed');


  // mod.include('Handle_Geom_Geometry');
  // mod.include('Handle_Geom_Surface');
  // mod.include('Handle_Geom_ElementarySurface');
  // mod.include('Handle_Geom_SphericalSurface');
  // mod.include('Handle_Geom_CylindricalSurface');
  // mod.include('Handle_Geom_AxisPlacement');
  // mod.include('Handle_Geom_Axis1Placement');
  // mod.find('Handle_*').include('*')
};
