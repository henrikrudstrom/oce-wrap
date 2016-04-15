module.exports = function(mod) {
  console.log("CONF")
  mod.name = 'handle'
    mod.libraries = [
      'TKernel', 'TKMath', 'TKAdvTools', 'TKG2d', 'TKG3d'
    ];
};
