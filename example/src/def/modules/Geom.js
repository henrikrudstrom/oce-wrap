const camelCase = require('camel-case');
module.exports = function(mod) {
  mod.name = 'Geom';
  mod.depends('gp')
  mod.camelCase('*::*');
  mod.removePrefix('*');

  mod.include('Geom_Geometry');
  mod.include('Geom_Surface');
  mod.include('Geom_ElementarySurface');
  mod.include('Geom_SphericalSurface');
  mod.include('Geom_CylindricalSurface');
  mod.include('Geom_AxisPlacement');
  mod.include('Geom_Axis1Placement');
  mod.find('*').include('*')
  mod.find('*')
    .argout('Bounds')
    .argout('TransformParameters')
    .argout('Coefficients');
  //mod.noHandle('*');
  mod.include('Handle_Geom_Geometry');
  mod.include('Handle_Geom_Surface');
  mod.include('Handle_Geom_ElementarySurface');
  mod.include('Handle_Geom_SphericalSurface');
  mod.include('Handle_Geom_CylindricalSurface');
  mod.include('Handle_Geom_AxisPlacement');
  mod.include('Handle_Geom_Axis1Placement');
};
