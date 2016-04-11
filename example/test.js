var gp = require('./dist/lib/gp.node')
var brep = require('./dist/lib/brepTest.node')
var tesselate = require('./dist/lib/tesselate.node')
var extend = require('extend');
var sphere = new gp.Sphere(new gp.Ax3(
  new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
), 5);
var make = new brep.MakeFace(sphere);
var sphereshape = make.face();
console.log("go!")

function tess(shape, d) {
  var t = new tesselate.Tesselator(shape, d || 0.01);
  var res = t.exportJSON()
  console.log(res);
  return JSON.parse(res);
}
var t = tess(sphereshape, 0.2)
var fs = require('fs');
fs.writeFileSync('mesh.json', JSON.stringify(t, null, 2));
