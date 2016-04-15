var gp = require('../lib/gp.node');

describe('gp.Dir', function() {
  it('cross(gp.Dir)', function() {
    var obj = new gp.Dir(1, 0, 0);
    var res = obj.cross(new gp.Dir(0, 1, 0));
  });

  it('crossed(gp.Dir)', function() {
    var obj = new gp.Dir(1, 0, 0);
    var res = obj.crossed(new gp.Dir(0, 1, 0));
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Dir');
  });

  it('crossCross(gp.Dir, gp.Dir)', function() {
    var obj = new gp.Dir(1, 0, 0);
    var res = obj.crossCross(new gp.Dir(1, 0, 0), new gp.Dir(0, 0, 1));
  });

  it('crossCrossed(gp.Dir, gp.Dir)', function() {
    var obj = new gp.Dir(1, 0, 0);
    var res = obj.crossCrossed(new gp.Dir(1, 0, 0), new gp.Dir(0, 0, 1));
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Dir');
  });
});

describe('gp.Ax2', function() {
  it('Ax2(gp.Pnt, gp.Dir, gp.Dir)', function() {
    var res = new gp.Ax2(
      new gp.Pnt(1, 3, 2), new gp.Dir(0, 1, 0), new gp.Dir(0, 0, 1)
    );
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Ax2');
  });
});
describe('gp.Ax3', function() {
  it('Ax3(gp.Pnt, gp.Dir, gp.Dir)', function() {
    var res = new gp.Ax3(
      new gp.Pnt(1, 3, 2), new gp.Dir(0, 1, 0), new gp.Dir(0, 0, 1)
    );
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Ax3');
  });
});
