module.exports = function(mod) {
  mod.name = 'example';
  mod.depends('anotherMod');
  mod.include('gp_Vec2d');
  mod.find('*').include('*');
  mod.camelCase('*::*');
  mod.removePrefix('*');
};
