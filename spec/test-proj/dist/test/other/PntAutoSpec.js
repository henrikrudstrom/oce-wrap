var other = require('../../lib/other.js');
var create = require('../create.js')
describe('other.Pnt', function(){


  it('Pnt()', function(){
    var res = new other.Pnt();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Pnt');
  });



  it('x()', function(){
    var obj = create.other.Pnt();
    var res = obj.x();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('y()', function(){
    var obj = create.other.Pnt();
    var res = obj.y();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('z()', function(){
    var obj = create.other.Pnt();
    var res = obj.z();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


    // arguments or return type not wrapped
  xit('xyz()', function(){
    var obj = create.other.Pnt();
    var res = obj.xyz();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


    // arguments or return type not wrapped
  xit('changeCoord()', function(){
    var obj = create.other.Pnt();
    var res = obj.changeCoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpPntcoord()', function(){
    var obj = create.other.Pnt();
    var res = obj.csfdbGetgpPntcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });

});
