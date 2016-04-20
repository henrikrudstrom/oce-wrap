var other = require('../../lib/other.node');
var create = require('../create.js')
describe('other.gp_Pnt', function(){


  it('gp_Pnt()', function(){
    // console.log('gp_Pnt()')
    var res = new other.gp_Pnt();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('gp_Pnt(gp_XYZ)', function(){
    // console.log('gp_Pnt(gp_XYZ)')
    var res = new other.gp_Pnt(create.gp_XYZ());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  it('gp_Pnt(other.double, other.double, other.double)', function(){
    // console.log('gp_Pnt(other.double, other.double, other.double)')
    var res = new other.gp_Pnt(9, 9.5, 10);
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });



  // arguments or return type not wrapped
  xit('setCoord(Standard_Integer, other.double)', function(){
    // console.log('setCoord(Standard_Integer, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.setCoord(create.Standard_Integer(), 10.5);
  });


  it('setCoord(other.double, other.double, other.double)', function(){
    // console.log('setCoord(other.double, other.double, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.setCoord(11, 11.5, 12);
  });


  it('setX(other.double)', function(){
    // console.log('setX(other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.setX(12.5);
  });


  it('setY(other.double)', function(){
    // console.log('setY(other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.setY(13);
  });


  it('setZ(other.double)', function(){
    // console.log('setZ(other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.setZ(13.5);
  });


  // arguments or return type not wrapped
  xit('setXyz(gp_XYZ)', function(){
    // console.log('setXyz(gp_XYZ)')
    var obj = create.other.gp_Pnt();
    var res = obj.setXyz(create.gp_XYZ());
  });


  // arguments or return type not wrapped
  xit('coord(Standard_Integer)', function(){
    // console.log('coord(Standard_Integer)')
    var obj = create.other.gp_Pnt();
    var res = obj.coord(create.Standard_Integer());
    expect(typeof res).toBe('number');
  });


  it('coord(other.double, other.double, other.double)', function(){
    // console.log('coord(other.double, other.double, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.coord(14, 14.5, 15);
  });


  it('x()', function(){
    // console.log('x()')
    var obj = create.other.gp_Pnt();
    var res = obj.x();
    expect(typeof res).toBe('number');
  });


  it('y()', function(){
    // console.log('y()')
    var obj = create.other.gp_Pnt();
    var res = obj.y();
    expect(typeof res).toBe('number');
  });


  it('z()', function(){
    // console.log('z()')
    var obj = create.other.gp_Pnt();
    var res = obj.z();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('xyz()', function(){
    // console.log('xyz()')
    var obj = create.other.gp_Pnt();
    var res = obj.xyz();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


  // arguments or return type not wrapped
  xit('coord()', function(){
    // console.log('coord()')
    var obj = create.other.gp_Pnt();
    var res = obj.coord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


  // arguments or return type not wrapped
  xit('changeCoord()', function(){
    // console.log('changeCoord()')
    var obj = create.other.gp_Pnt();
    var res = obj.changeCoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


  // arguments or return type not wrapped
  xit('baryCenter(other.double, other.gp_Pnt, other.double)', function(){
    // console.log('baryCenter(other.double, other.gp_Pnt, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.baryCenter(15.5, create.other.gp_Pnt(), 16);
  });


  // arguments or return type not wrapped
  xit('isEqual(other.gp_Pnt, other.double)', function(){
    // console.log('isEqual(other.gp_Pnt, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.isEqual(create.other.gp_Pnt(), 16.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('distance(other.gp_Pnt)', function(){
    // console.log('distance(other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.distance(create.other.gp_Pnt());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('squareDistance(other.gp_Pnt)', function(){
    // console.log('squareDistance(other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.squareDistance(create.other.gp_Pnt());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('mirror(other.gp_Pnt)', function(){
    // console.log('mirror(other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirror(create.other.gp_Pnt());
  });


  // arguments or return type not wrapped
  xit('mirrored(other.gp_Pnt)', function(){
    // console.log('mirrored(other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirrored(create.other.gp_Pnt());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('mirror(gp_Ax1)', function(){
    // console.log('mirror(gp_Ax1)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirror(create.gp_Ax1());
  });


  // arguments or return type not wrapped
  xit('mirrored(gp_Ax1)', function(){
    // console.log('mirrored(gp_Ax1)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirrored(create.gp_Ax1());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('mirror(example.gp_Ax2)', function(){
    // console.log('mirror(example.gp_Ax2)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirror(create.example.gp_Ax2());
  });


  // arguments or return type not wrapped
  xit('mirrored(example.gp_Ax2)', function(){
    // console.log('mirrored(example.gp_Ax2)')
    var obj = create.other.gp_Pnt();
    var res = obj.mirrored(create.example.gp_Ax2());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('rotate(gp_Ax1, other.double)', function(){
    // console.log('rotate(gp_Ax1, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.rotate(create.gp_Ax1(), 17);
  });


  // arguments or return type not wrapped
  xit('rotated(gp_Ax1, other.double)', function(){
    // console.log('rotated(gp_Ax1, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.rotated(create.gp_Ax1(), 17.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('scale(other.gp_Pnt, other.double)', function(){
    // console.log('scale(other.gp_Pnt, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.scale(create.other.gp_Pnt(), 18);
  });


  // arguments or return type not wrapped
  xit('scaled(other.gp_Pnt, other.double)', function(){
    // console.log('scaled(other.gp_Pnt, other.double)')
    var obj = create.other.gp_Pnt();
    var res = obj.scaled(create.other.gp_Pnt(), 18.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('transform(gp_Trsf)', function(){
    // console.log('transform(gp_Trsf)')
    var obj = create.other.gp_Pnt();
    var res = obj.transform(create.gp_Trsf());
  });


  // arguments or return type not wrapped
  xit('transformed(gp_Trsf)', function(){
    // console.log('transformed(gp_Trsf)')
    var obj = create.other.gp_Pnt();
    var res = obj.transformed(create.gp_Trsf());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Vec)', function(){
    // console.log('translate(other.gp_Vec)')
    var obj = create.other.gp_Pnt();
    var res = obj.translate(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Vec)', function(){
    // console.log('translated(other.gp_Vec)')
    var obj = create.other.gp_Pnt();
    var res = obj.translated(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Pnt, other.gp_Pnt)', function(){
    // console.log('translate(other.gp_Pnt, other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.translate(create.other.gp_Pnt(), create.other.gp_Pnt());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Pnt, other.gp_Pnt)', function(){
    // console.log('translated(other.gp_Pnt, other.gp_Pnt)')
    var obj = create.other.gp_Pnt();
    var res = obj.translated(create.other.gp_Pnt(), create.other.gp_Pnt());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpPntcoord()', function(){
    // console.log('csfdbGetgpPntcoord()')
    var obj = create.other.gp_Pnt();
    var res = obj.csfdbGetgpPntcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });

});
