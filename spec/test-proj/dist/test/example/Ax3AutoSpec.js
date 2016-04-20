var example = require('../../lib/example.js');
var other = require('../../lib/other.js');
var create = require('../create.js')
describe('example.Ax3', function(){


  it('Ax3()', function(){
    var res = new example.Ax3();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Ax3');
  });



  it('xreverse()', function(){
    var obj = create.example.Ax3();
    var res = obj.xreverse();
  });


  it('yreverse()', function(){
    var obj = create.example.Ax3();
    var res = obj.yreverse();
  });


  it('zreverse()', function(){
    var obj = create.example.Ax3();
    var res = obj.zreverse();
  });


    // arguments or return type not wrapped
  xit('axis()', function(){
    var obj = create.example.Ax3();
    var res = obj.axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


  it('ax2()', function(){
    var obj = create.example.Ax3();
    var res = obj.ax2();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Ax2');
  });


    // arguments or return type not wrapped
  xit('direction()', function(){
    var obj = create.example.Ax3();
    var res = obj.direction();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  it('location()', function(){
    var obj = create.example.Ax3();
    var res = obj.location();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Pnt');
  });


    // arguments or return type not wrapped
  xit('xdirection()', function(){
    var obj = create.example.Ax3();
    var res = obj.xdirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


    // arguments or return type not wrapped
  xit('ydirection()', function(){
    var obj = create.example.Ax3();
    var res = obj.ydirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  it('direct()', function(){
    var obj = create.example.Ax3();
    var res = obj.direct();
    expect(typeof res).toBe('boolean');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx3Axis()', function(){
    var obj = create.example.Ax3();
    var res = obj.csfdbGetgpAx3Axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx3Vydir()', function(){
    var obj = create.example.Ax3();
    var res = obj.csfdbGetgpAx3Vydir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


    // arguments or return type not wrapped
  xit('csfdbGetgpAx3Vxdir()', function(){
    var obj = create.example.Ax3();
    var res = obj.csfdbGetgpAx3Vxdir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });

});
