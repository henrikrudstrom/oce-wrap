module.exports = function(mod) {
  mod.name = 'tesselate';
  mod.shadowed = true;
  mod.extraSources = ['Tesselator.cpp'];
  mod.libraries = [
    'TKernel', 'TKMath', 'TKAdvTools', 'TKG2d', 'TKG3d', 'TKGeomBase',
    'TKBRep', 'TKGeomAlgo', 'TKTopAlgo', 'TKPrim', 'TKBO', 'TKMesh', 'TKXMesh', 'TKV3d',
    'TKService', 'TKV3d', 'TKMeshVS', 'TKOpenGl'
  ];
};
