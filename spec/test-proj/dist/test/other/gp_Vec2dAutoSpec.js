var other = require('../../lib/other.node');
var create = require('../create.js')
describe('other.gp_Vec2d', function(){


  it('gp_Vec2d()', function(){
    // console.log('gp_Vec2d()')
    var res = new other.gp_Vec2d();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('gp_Vec2d(gp_Dir2d)', function(){
    // console.log('gp_Vec2d(gp_Dir2d)')
    var res = new other.gp_Vec2d(create.gp_Dir2d());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('gp_Vec2d(gp_XY)', function(){
    // console.log('gp_Vec2d(gp_XY)')
    var res = new other.gp_Vec2d(create.gp_XY());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('gp_Vec2d(other.double, other.double)', function(){
    // console.log('gp_Vec2d(other.double, other.double)')
    var res = new other.gp_Vec2d(44.5, 45);
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('gp_Vec2d(other.gp_Pnt2d, other.gp_Pnt2d)', function(){
    // console.log('gp_Vec2d(other.gp_Pnt2d, other.gp_Pnt2d)')
    var res = new other.gp_Vec2d(create.other.gp_Pnt2d(), create.other.gp_Pnt2d());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });



  // arguments or return type not wrapped
  xit('setCoord(Standard_Integer, other.double)', function(){
    // console.log('setCoord(Standard_Integer, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setCoord(create.Standard_Integer(), 45.5);
  });


  it('setCoord(other.double, other.double)', function(){
    // console.log('setCoord(other.double, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setCoord(46, 46.5);
  });


  it('setX(other.double)', function(){
    // console.log('setX(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setX(47);
  });


  it('setY(other.double)', function(){
    // console.log('setY(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setY(47.5);
  });


  // arguments or return type not wrapped
  xit('setXy(gp_XY)', function(){
    // console.log('setXy(gp_XY)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setXy(create.gp_XY());
  });


  // arguments or return type not wrapped
  xit('coord(Standard_Integer)', function(){
    // console.log('coord(Standard_Integer)')
    var obj = create.other.gp_Vec2d();
    var res = obj.coord(create.Standard_Integer());
    expect(typeof res).toBe('number');
  });


  it('coord(other.double, other.double)', function(){
    // console.log('coord(other.double, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.coord(48, 48.5);
  });


  it('x()', function(){
    // console.log('x()')
    var obj = create.other.gp_Vec2d();
    var res = obj.x();
    expect(typeof res).toBe('number');
  });


  it('y()', function(){
    // console.log('y()')
    var obj = create.other.gp_Vec2d();
    var res = obj.y();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('xy()', function(){
    // console.log('xy()')
    var obj = create.other.gp_Vec2d();
    var res = obj.xy();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });


  // arguments or return type not wrapped
  xit('isEqual(other.gp_Vec2d, other.double, other.double)', function(){
    // console.log('isEqual(other.gp_Vec2d, other.double, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.isEqual(create.other.gp_Vec2d(), 49, 49.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isNormal(other.gp_Vec2d, other.double)', function(){
    // console.log('isNormal(other.gp_Vec2d, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.isNormal(create.other.gp_Vec2d(), 50);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isOpposite(other.gp_Vec2d, other.double)', function(){
    // console.log('isOpposite(other.gp_Vec2d, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.isOpposite(create.other.gp_Vec2d(), 50.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isParallel(other.gp_Vec2d, other.double)', function(){
    // console.log('isParallel(other.gp_Vec2d, other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.isParallel(create.other.gp_Vec2d(), 51);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('angle(other.gp_Vec2d)', function(){
    // console.log('angle(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.angle(create.other.gp_Vec2d());
    expect(typeof res).toBe('number');
  });


  it('magnitude()', function(){
    // console.log('magnitude()')
    var obj = create.other.gp_Vec2d();
    var res = obj.magnitude();
    expect(typeof res).toBe('number');
  });


  it('squareMagnitude()', function(){
    // console.log('squareMagnitude()')
    var obj = create.other.gp_Vec2d();
    var res = obj.squareMagnitude();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('add(other.gp_Vec2d)', function(){
    // console.log('add(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.add(create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('added(other.gp_Vec2d)', function(){
    // console.log('added(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.added(create.other.gp_Vec2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('crossed(other.gp_Vec2d)', function(){
    // console.log('crossed(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.crossed(create.other.gp_Vec2d());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('crossMagnitude(other.gp_Vec2d)', function(){
    // console.log('crossMagnitude(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.crossMagnitude(create.other.gp_Vec2d());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('crossSquareMagnitude(other.gp_Vec2d)', function(){
    // console.log('crossSquareMagnitude(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.crossSquareMagnitude(create.other.gp_Vec2d());
    expect(typeof res).toBe('number');
  });


  it('divide(other.double)', function(){
    // console.log('divide(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.divide(51.5);
  });


  // arguments or return type not wrapped
  xit('divided(other.double)', function(){
    // console.log('divided(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.divided(52);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('dot(other.gp_Vec2d)', function(){
    // console.log('dot(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.dot(create.other.gp_Vec2d());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('getNormal()', function(){
    // console.log('getNormal()')
    var obj = create.other.gp_Vec2d();
    var res = obj.getNormal();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('multiply(other.double)', function(){
    // console.log('multiply(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.multiply(52.5);
  });


  // arguments or return type not wrapped
  xit('multiplied(other.double)', function(){
    // console.log('multiplied(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.multiplied(53);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('normalize()', function(){
    // console.log('normalize()')
    var obj = create.other.gp_Vec2d();
    var res = obj.normalize();
  });


  // arguments or return type not wrapped
  xit('normalized()', function(){
    // console.log('normalized()')
    var obj = create.other.gp_Vec2d();
    var res = obj.normalized();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('reverse()', function(){
    // console.log('reverse()')
    var obj = create.other.gp_Vec2d();
    var res = obj.reverse();
  });


  // arguments or return type not wrapped
  xit('reversed()', function(){
    // console.log('reversed()')
    var obj = create.other.gp_Vec2d();
    var res = obj.reversed();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('subtract(other.gp_Vec2d)', function(){
    // console.log('subtract(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.subtract(create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('subtracted(other.gp_Vec2d)', function(){
    // console.log('subtracted(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.subtracted(create.other.gp_Vec2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec2d, other.double, other.gp_Vec2d, other.gp_Vec2d)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec2d, other.double, other.gp_Vec2d, other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setLinearForm(53.5, create.other.gp_Vec2d(), 54, create.other.gp_Vec2d(), create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec2d, other.double, other.gp_Vec2d)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec2d, other.double, other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setLinearForm(54.5, create.other.gp_Vec2d(), 55, create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec2d, other.gp_Vec2d)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec2d, other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setLinearForm(55.5, create.other.gp_Vec2d(), create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.gp_Vec2d, other.gp_Vec2d)', function(){
    // console.log('setLinearForm(other.gp_Vec2d, other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.setLinearForm(create.other.gp_Vec2d(), create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('mirror(other.gp_Vec2d)', function(){
    // console.log('mirror(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.mirror(create.other.gp_Vec2d());
  });


  // arguments or return type not wrapped
  xit('mirrored(other.gp_Vec2d)', function(){
    // console.log('mirrored(other.gp_Vec2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.mirrored(create.other.gp_Vec2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('mirror(gp_Ax2d)', function(){
    // console.log('mirror(gp_Ax2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.mirror(create.gp_Ax2d());
  });


  // arguments or return type not wrapped
  xit('mirrored(gp_Ax2d)', function(){
    // console.log('mirrored(gp_Ax2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.mirrored(create.gp_Ax2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('rotate(other.double)', function(){
    // console.log('rotate(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.rotate(56);
  });


  // arguments or return type not wrapped
  xit('rotated(other.double)', function(){
    // console.log('rotated(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.rotated(56.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  it('scale(other.double)', function(){
    // console.log('scale(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.scale(57);
  });


  // arguments or return type not wrapped
  xit('scaled(other.double)', function(){
    // console.log('scaled(other.double)')
    var obj = create.other.gp_Vec2d();
    var res = obj.scaled(57.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('transform(gp_Trsf2d)', function(){
    // console.log('transform(gp_Trsf2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.transform(create.gp_Trsf2d());
  });


  // arguments or return type not wrapped
  xit('transformed(gp_Trsf2d)', function(){
    // console.log('transformed(gp_Trsf2d)')
    var obj = create.other.gp_Vec2d();
    var res = obj.transformed(create.gp_Trsf2d());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec2d');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpVec2Dcoord()', function(){
    // console.log('csfdbGetgpVec2Dcoord()')
    var obj = create.other.gp_Vec2d();
    var res = obj.csfdbGetgpVec2Dcoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XY');
  });

});
