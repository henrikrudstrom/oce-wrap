var other = require('../../lib/other.js');
var create = require('../create.js')
describe('other.Vec', function(){


  it('Vec()', function(){
    var res = new other.Vec();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec');
  });



  it('x()', function(){
    var obj = create.other.Vec();
    var res = obj.x();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('y()', function(){
    var obj = create.other.Vec();
    var res = obj.y();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('z()', function(){
    var obj = create.other.Vec();
    var res = obj.z();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


    // arguments or return type not wrapped
  xit('xyz()', function(){
    var obj = create.other.Vec();
    var res = obj.xyz();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


  it('magnitude()', function(){
    var obj = create.other.Vec();
    var res = obj.magnitude();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('squareMagnitude()', function(){
    var obj = create.other.Vec();
    var res = obj.squareMagnitude();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('normalize()', function(){
    var obj = create.other.Vec();
    var res = obj.normalize();
  });


  it('normalized()', function(){
    var obj = create.other.Vec();
    var res = obj.normalized();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec');
  });


  it('reverse()', function(){
    var obj = create.other.Vec();
    var res = obj.reverse();
  });


  it('reversed()', function(){
    var obj = create.other.Vec();
    var res = obj.reversed();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Vec');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpVeccoord()', function(){
    var obj = create.other.Vec();
    var res = obj.csfdbGetgpVeccoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });

});
