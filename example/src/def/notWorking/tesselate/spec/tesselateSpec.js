var gp = require('./dist/lib/gp.node');
var brep = require('./dist/lib/brepTest.node');
var tesselate = require('./dist/lib/tesselate.js');

describe('tesselate.Tesselator', function() {
  it('works', function() {
    var sphere = new gp.Sphere(new gp.Ax3(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
    ), 5);
    var make = new brep.MakeFace(sphere);
    var sphereShape = make.face();
    var res = tesselate(sphereShape);
    expect(typeof res.vertices).toBe('object');
    expect(typeof res.triangles).toBe('object');
    expect(typeof res.normals).toBe('object');
    expect(typeof res.vertices[0]).toBe('object');
    expect(typeof res.triangles[0]).toBe('object');
    expect(typeof res.normals[0]).toBe('object');
  });
});
