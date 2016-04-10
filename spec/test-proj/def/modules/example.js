module.exports = function(mod) {
  mod.name = 'example';
  mod.depends('other');
  mod.include('gp_Ax2');
  mod.include('gp_Ax3');
  mod.find('*').include('*');
  mod.camelCase('*::*');
  mod.removePrefix('*');
};
