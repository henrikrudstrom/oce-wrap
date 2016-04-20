var example = require('../../lib/example.node');
var other = require('../../lib/other.node');
var create = require('../create.js')
describe('example.gp_Ax2', function(){


  it('gp_Ax2()', function(){
    // console.log('gp_Ax2()')
    var res = new example.gp_Ax2();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('gp_Ax2(other.gp_Pnt, gp_Dir, gp_Dir)', function(){
    // console.log('gp_Ax2(other.gp_Pnt, gp_Dir, gp_Dir)')
    var res = new example.gp_Ax2(create.other.gp_Pnt(), create.gp_Dir(), create.gp_Dir());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('gp_Ax2(other.gp_Pnt, gp_Dir)', function(){
    // console.log('gp_Ax2(other.gp_Pnt, gp_Dir)')
    var res = new example.gp_Ax2(create.other.gp_Pnt(), create.gp_Dir());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });



  // arguments or return type not wrapped
  xit('setAxis(gp_Ax1)', function(){
    // console.log('setAxis(gp_Ax1)')
    var obj = create.example.gp_Ax2();
    var res = obj.setAxis(create.gp_Ax1());
  });


  // arguments or return type not wrapped
  xit('setDirection(gp_Dir)', function(){
    // console.log('setDirection(gp_Dir)')
    var obj = create.example.gp_Ax2();
    var res = obj.setDirection(create.gp_Dir());
  });


  // arguments or return type not wrapped
  xit('setLocation(other.gp_Pnt)', function(){
    // console.log('setLocation(other.gp_Pnt)')
    var obj = create.example.gp_Ax2();
    var res = obj.setLocation(create.other.gp_Pnt());
  });


  // arguments or return type not wrapped
  xit('setXdirection(gp_Dir)', function(){
    // console.log('setXdirection(gp_Dir)')
    var obj = create.example.gp_Ax2();
    var res = obj.setXdirection(create.gp_Dir());
  });


  // arguments or return type not wrapped
  xit('setYdirection(gp_Dir)', function(){
    // console.log('setYdirection(gp_Dir)')
    var obj = create.example.gp_Ax2();
    var res = obj.setYdirection(create.gp_Dir());
  });


  // arguments or return type not wrapped
  xit('angle(example.gp_Ax2)', function(){
    // console.log('angle(example.gp_Ax2)')
    var obj = create.example.gp_Ax2();
    var res = obj.angle(create.example.gp_Ax2());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('axis()', function(){
    // console.log('axis()')
    var obj = create.example.gp_Ax2();
    var res = obj.axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


  // arguments or return type not wrapped
  xit('direction()', function(){
    // console.log('direction()')
    var obj = create.example.gp_Ax2();
    var res = obj.direction();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  // arguments or return type not wrapped
  xit('location()', function(){
    // console.log('location()')
    var obj = create.example.gp_Ax2();
    var res = obj.location();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('xdirection()', function(){
    // console.log('xdirection()')
    var obj = create.example.gp_Ax2();
    var res = obj.xdirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  // arguments or return type not wrapped
  xit('ydirection()', function(){
    // console.log('ydirection()')
    var obj = create.example.gp_Ax2();
    var res = obj.ydirection();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  // arguments or return type not wrapped
  xit('isCoplanar(example.gp_Ax2, other.double, other.double)', function(){
    // console.log('isCoplanar(example.gp_Ax2, other.double, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.isCoplanar(create.example.gp_Ax2(), 1, 1.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isCoplanar(gp_Ax1, other.double, other.double)', function(){
    // console.log('isCoplanar(gp_Ax1, other.double, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.isCoplanar(create.gp_Ax1(), 2, 2.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('mirror(other.gp_Pnt)', function(){
    // console.log('mirror(other.gp_Pnt)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirror(create.other.gp_Pnt());
  });


  // arguments or return type not wrapped
  xit('mirrored(other.gp_Pnt)', function(){
    // console.log('mirrored(other.gp_Pnt)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirrored(create.other.gp_Pnt());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('mirror(gp_Ax1)', function(){
    // console.log('mirror(gp_Ax1)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirror(create.gp_Ax1());
  });


  // arguments or return type not wrapped
  xit('mirrored(gp_Ax1)', function(){
    // console.log('mirrored(gp_Ax1)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirrored(create.gp_Ax1());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('mirror(example.gp_Ax2)', function(){
    // console.log('mirror(example.gp_Ax2)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirror(create.example.gp_Ax2());
  });


  // arguments or return type not wrapped
  xit('mirrored(example.gp_Ax2)', function(){
    // console.log('mirrored(example.gp_Ax2)')
    var obj = create.example.gp_Ax2();
    var res = obj.mirrored(create.example.gp_Ax2());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('rotate(gp_Ax1, other.double)', function(){
    // console.log('rotate(gp_Ax1, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.rotate(create.gp_Ax1(), 3);
  });


  // arguments or return type not wrapped
  xit('rotated(gp_Ax1, other.double)', function(){
    // console.log('rotated(gp_Ax1, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.rotated(create.gp_Ax1(), 3.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('scale(other.gp_Pnt, other.double)', function(){
    // console.log('scale(other.gp_Pnt, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.scale(create.other.gp_Pnt(), 4);
  });


  // arguments or return type not wrapped
  xit('scaled(other.gp_Pnt, other.double)', function(){
    // console.log('scaled(other.gp_Pnt, other.double)')
    var obj = create.example.gp_Ax2();
    var res = obj.scaled(create.other.gp_Pnt(), 4.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('transform(gp_Trsf)', function(){
    // console.log('transform(gp_Trsf)')
    var obj = create.example.gp_Ax2();
    var res = obj.transform(create.gp_Trsf());
  });


  // arguments or return type not wrapped
  xit('transformed(gp_Trsf)', function(){
    // console.log('transformed(gp_Trsf)')
    var obj = create.example.gp_Ax2();
    var res = obj.transformed(create.gp_Trsf());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Vec)', function(){
    // console.log('translate(other.gp_Vec)')
    var obj = create.example.gp_Ax2();
    var res = obj.translate(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Vec)', function(){
    // console.log('translated(other.gp_Vec)')
    var obj = create.example.gp_Ax2();
    var res = obj.translated(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Pnt, other.gp_Pnt)', function(){
    // console.log('translate(other.gp_Pnt, other.gp_Pnt)')
    var obj = create.example.gp_Ax2();
    var res = obj.translate(create.other.gp_Pnt(), create.other.gp_Pnt());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Pnt, other.gp_Pnt)', function(){
    // console.log('translated(other.gp_Pnt, other.gp_Pnt)')
    var obj = create.example.gp_Ax2();
    var res = obj.translated(create.other.gp_Pnt(), create.other.gp_Pnt());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax2');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpAx2Axis()', function(){
    // console.log('csfdbGetgpAx2Axis()')
    var obj = create.example.gp_Ax2();
    var res = obj.csfdbGetgpAx2Axis();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Ax1');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpAx2Vydir()', function(){
    // console.log('csfdbGetgpAx2Vydir()')
    var obj = create.example.gp_Ax2();
    var res = obj.csfdbGetgpAx2Vydir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpAx2Vxdir()', function(){
    // console.log('csfdbGetgpAx2Vxdir()')
    var obj = create.example.gp_Ax2();
    var res = obj.csfdbGetgpAx2Vxdir();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Dir');
  });

});
