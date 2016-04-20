var other = require('../../lib/other.js');
var create = require('../create.js')
describe('other.Pnt2d', function(){


  it('Pnt2d()', function(){
    var res = new other.Pnt2d();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Pnt2d');
  });



  it('x()', function(){
    var obj = create.other.Pnt2d();
    var res = obj.x();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


  it('y()', function(){
    var obj = create.other.Pnt2d();
    var res = obj.y();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Real');
  });


    // arguments or return type not wrapped
  xit('xy()', function(){
    var obj = create.other.Pnt2d();
    var res = obj.xy();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


    // arguments or return type not wrapped
  xit('changeCoord()', function(){
    var obj = create.other.Pnt2d();
    var res = obj.changeCoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpPnt2Dcoord()', function(){
    var obj = create.other.Pnt2d();
    var res = obj.csfdbGetgpPnt2Dcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });

});
