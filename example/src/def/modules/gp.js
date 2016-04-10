module.exports = function(mod) {
  mod.name = 'gp';
  mod.include('Standard_Real');
  mod.include('Standard_Integer');
  mod.include('Standard_Boolean');
  mod.include('Standard_CString');
  mod.include('gp_Pnt');
  mod.include('gp_Vec');
  mod.include('gp_XYZ');
  mod.include('gp_Dir');
  mod.include('gp_Ax2');
  mod.include('gp_Ax3');
  mod.include('gp_Trsf');
  mod.find('*').include('*');
  mod.find('*').exclude('_*');
  mod.find('*')
    .exclude('*Coord')
    .exclude('XYZ')
    .exclude('XY');
  mod.camelCase('*::*');
  mod.removePrefix('*');
};
  // const trsfs = ['Mirror', 'Rotate', 'Scale', 'Transform', 'Translate'];
  // trsfs.forEach((trsf) => {
  //   var self = trsf.replace(/e$/, '') + 'ed';
  //   conf.rename(self, camelCase(trsf));
  // });
