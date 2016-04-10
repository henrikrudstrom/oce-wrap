var example = require('../lib/example.js');
var other = require('../lib/other.js');

module.exports.other = {
  XYZ() {
    return new other.XYZ(5, 5, 5);
  },
  Vec() {
    return new other.Pnt(10, 20, 40);
  },
  Pnt() {
    return new other.Pnt(40, 20, 10);
  }
};
module.exports.example = {
  Dir() {
    return new example.Dir(1, 2, 3);
  },
  Ax2() {
    return new example.Ax2(
      new other.Pnt(1, 1, 1), new example.Dir(0, 0, 1), new example.Dir(1, 0, 0)
    );
  },
  Ax3() {
    return new example.Ax3(
      new other.Pnt(1, 1, 1), new example.Dir(0, 0, 1), new example.Dir(1, 0, 0)
    );
  },
  Trsf() {
    return new example.Trsf();
  }
};
