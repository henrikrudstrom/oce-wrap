var other = require('../../lib/other.node');
var create = require('../create.js')
describe('other.gp_Pnt2d', function(){


  it('gp_Pnt2d()', function(){
    // console.log('gp_Pnt2d()')
    var res = new other.gp_Pnt2d();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('gp_Pnt2d(gp_XY)', function(){
    // console.log('gp_Pnt2d(gp_XY)')
    var res = new other.gp_Pnt2d(create.gp_XY());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  it('gp_Pnt2d(other.double, other.double)', function(){
    // console.log('gp_Pnt2d(other.double, other.double)')
    var res = new other.gp_Pnt2d(19, 19.5);
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });



  // arguments or return type not wrapped
  xit('setCoord(Standard_Integer, other.double)', function(){
    // console.log('setCoord(Standard_Integer, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.setCoord(create.Standard_Integer(), 20);
  });


  it('setCoord(other.double, other.double)', function(){
    // console.log('setCoord(other.double, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.setCoord(20.5, 21);
  });


  it('setX(other.double)', function(){
    // console.log('setX(other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.setX(21.5);
  });


  it('setY(other.double)', function(){
    // console.log('setY(other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.setY(22);
  });


  // arguments or return type not wrapped
  xit('setXy(gp_XY)', function(){
    // console.log('setXy(gp_XY)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.setXy(create.gp_XY());
  });


  // arguments or return type not wrapped
  xit('coord(Standard_Integer)', function(){
    // console.log('coord(Standard_Integer)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.coord(create.Standard_Integer());
    expect(typeof res).toBe('number');
  });


  it('coord(other.double, other.double)', function(){
    // console.log('coord(other.double, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.coord(22.5, 23);
  });


  it('x()', function(){
    // console.log('x()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.x();
    expect(typeof res).toBe('number');
  });


  it('y()', function(){
    // console.log('y()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.y();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('xy()', function(){
    // console.log('xy()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.xy();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


  // arguments or return type not wrapped
  xit('coord()', function(){
    // console.log('coord()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.coord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


  // arguments or return type not wrapped
  xit('changeCoord()', function(){
    // console.log('changeCoord()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.changeCoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


  // arguments or return type not wrapped
  xit('isEqual(other.gp_Pnt2d, other.double)', function(){
    // console.log('isEqual(other.gp_Pnt2d, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.isEqual(create.other.gp_Pnt2d(), 23.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('distance(other.gp_Pnt2d)', function(){
    // console.log('distance(other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.distance(create.other.gp_Pnt2d());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('squareDistance(other.gp_Pnt2d)', function(){
    // console.log('squareDistance(other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.squareDistance(create.other.gp_Pnt2d());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('mirror(other.gp_Pnt2d)', function(){
    // console.log('mirror(other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.mirror(create.other.gp_Pnt2d());
  });


  // arguments or return type not wrapped
  xit('mirrored(other.gp_Pnt2d)', function(){
    // console.log('mirrored(other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.mirrored(create.other.gp_Pnt2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('mirror(gp_Ax2d)', function(){
    // console.log('mirror(gp_Ax2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.mirror(create.gp_Ax2d());
  });


  // arguments or return type not wrapped
  xit('mirrored(gp_Ax2d)', function(){
    // console.log('mirrored(gp_Ax2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.mirrored(create.gp_Ax2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('rotate(other.gp_Pnt2d, other.double)', function(){
    // console.log('rotate(other.gp_Pnt2d, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.rotate(create.other.gp_Pnt2d(), 24);
  });


  // arguments or return type not wrapped
  xit('rotated(other.gp_Pnt2d, other.double)', function(){
    // console.log('rotated(other.gp_Pnt2d, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.rotated(create.other.gp_Pnt2d(), 24.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('scale(other.gp_Pnt2d, other.double)', function(){
    // console.log('scale(other.gp_Pnt2d, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.scale(create.other.gp_Pnt2d(), 25);
  });


  // arguments or return type not wrapped
  xit('scaled(other.gp_Pnt2d, other.double)', function(){
    // console.log('scaled(other.gp_Pnt2d, other.double)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.scaled(create.other.gp_Pnt2d(), 25.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('transform(gp_Trsf2d)', function(){
    // console.log('transform(gp_Trsf2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.transform(create.gp_Trsf2d());
  });


  // arguments or return type not wrapped
  xit('transformed(gp_Trsf2d)', function(){
    // console.log('transformed(gp_Trsf2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.transformed(create.gp_Trsf2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Vec2d)', function(){
    // console.log('translate(other.gp_Vec2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.translate(create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Vec2d)', function(){
    // console.log('translated(other.gp_Vec2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.translated(create.other.gp_Vec2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('translate(other.gp_Pnt2d, other.gp_Pnt2d)', function(){
    // console.log('translate(other.gp_Pnt2d, other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.translate(create.other.gp_Pnt2d(), create.other.gp_Pnt2d());
  });


  // arguments or return type not wrapped
  xit('translated(other.gp_Pnt2d, other.gp_Pnt2d)', function(){
    // console.log('translated(other.gp_Pnt2d, other.gp_Pnt2d)')
    var obj = create.other.gp_Pnt2d();
    var res = obj.translated(create.other.gp_Pnt2d(), create.other.gp_Pnt2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Pnt2d');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpPnt2Dcoord()', function(){
    // console.log('csfdbGetgpPnt2Dcoord()')
    var obj = create.other.gp_Pnt2d();
    var res = obj.csfdbGetgpPnt2Dcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });

});
