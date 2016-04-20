var example = require('../../lib/example.js');
var other = require('../../lib/other.js');
var create = require('../create.js')
describe('example.Ax2', function(){


  it('Ax2()', function(){
    var res = new example.Ax2();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Ax2');
  });



    // arguments or return type not wrapped
  xit('axis()', function(){
    var obj = create.example.Ax2();
    var res = obj.axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


    // arguments or return type not wrapped
  xit('direction()', function(){
    var obj = create.example.Ax2();
    var res = obj.direction();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  it('location()', function(){
    var obj = create.example.Ax2();
    var res = obj.location();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Pnt');
  });


    // arguments or return type not wrapped
  xit('xdirection()', function(){
    var obj = create.example.Ax2();
    var res = obj.xdirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


    // arguments or return type not wrapped
  xit('ydirection()', function(){
    var obj = create.example.Ax2();
    var res = obj.ydirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx2Axis()', function(){
    var obj = create.example.Ax2();
    var res = obj.csfdbGetgpAx2Axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx2Vydir()', function(){
    var obj = create.example.Ax2();
    var res = obj.csfdbGetgpAx2Vydir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx2Vxdir()', function(){
    var obj = create.example.Ax2();
    var res = obj.csfdbGetgpAx2Vxdir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });

});
