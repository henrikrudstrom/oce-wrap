module.exports = function(mod) {
  mod.name = 'example';
  mod.depends('other');
  mod.include('gp_Ax2');
  mod.include('gp_Ax3');
  mod.find('*').include('*');
  mod.find('*').renameCamelCase('*');
  mod.removePrefix('*');
};
