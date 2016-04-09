module.exports = function(mod) {
  mod.name = 'other';
  mod.include('Standard_Real');
  mod.include('gp_Pnt*');
  mod.include('gp_Vec*');
  mod.camelCase('*::*');
  mod.removePrefix('*');
};
