var gp = require('../../lib/gp.node');

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
  }
};
