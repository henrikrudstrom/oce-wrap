var other = require('../../lib/other.js');
var create = require('../create.js')
describe('other.Vec2d', function(){


  it('Vec2d()', function(){
    var res = new other.Vec2d();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec2d');
  });



  it('x()', function(){
    var obj = create.other.Vec2d();
    var res = obj.x();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('y()', function(){
    var obj = create.other.Vec2d();
    var res = obj.y();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


    // arguments or return type not wrapped
  xit('xy()', function(){
    var obj = create.other.Vec2d();
    var res = obj.xy();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


  it('magnitude()', function(){
    var obj = create.other.Vec2d();
    var res = obj.magnitude();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('squareMagnitude()', function(){
    var obj = create.other.Vec2d();
    var res = obj.squareMagnitude();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('getNormal()', function(){
    var obj = create.other.Vec2d();
    var res = obj.getNormal();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec2d');
  });


  it('normalize()', function(){
    var obj = create.other.Vec2d();
    var res = obj.normalize();
  });


  it('normalized()', function(){
    var obj = create.other.Vec2d();
    var res = obj.normalized();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec2d');
  });


  it('reverse()', function(){
    var obj = create.other.Vec2d();
    var res = obj.reverse();
  });


  it('reversed()', function(){
    var obj = create.other.Vec2d();
    var res = obj.reversed();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec2d');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpVec2Dcoord()', function(){
    var obj = create.other.Vec2d();
    var res = obj.csfdbGetgpVec2Dcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });

});
