var gp = require('../../lib/gp.node');
var brepTest = require('../../lib/brepTest.node');
module.exports.gp = {
  XYZ() {
    return new gp.XYZ(5, 5, 5);
  },
  Vec() {
    return new gp.Vec(10, 20, 40);
  },
  Pnt() {
    return new gp.Pnt(40, 20, 10);
  },
  Dir() {
    return new gp.Dir(1, 2, 3);
  },
  Ax1() {
    return new gp.Ax1(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1)
    );
  },
  Ax2() {
    return new gp.Ax2(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
    );
  },
  Ax3() {
    return new gp.Ax3(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
    );
  },
  Trsf() {
    return new gp.Trsf();
  },
  Sphere() {
    return new gp.Sphere(new gp.Ax3(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
    ), 5);
  },
  Cylinder() {
    return new gp.Cylinder(new gp.Ax3(
      new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1), new gp.Dir(1, 0, 0)
    ), 5);
  }
};
module.exports.brepTest = {
  MakeFace() {
    return new brepTest.MakeFace();
  },
  Shape() {
    var sphere = module.exports.gp.Sphere()
    var mk = new brepTest.MakeFace(sphere);

    return mk.face();
  },
  Face() {
    var sphere = module.exports.gp.Sphere()
    var mk = new brepTest.MakeFace(sphere);

    return mk.face();
  }

};
