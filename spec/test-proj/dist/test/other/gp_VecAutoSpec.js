var other = require('../../lib/other.node');
var create = require('../create.js')
describe('other.gp_Vec', function(){


  it('gp_Vec()', function(){
    // console.log('gp_Vec()')
    var res = new other.gp_Vec();
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('gp_Vec(gp_Dir)', function(){
    // console.log('gp_Vec(gp_Dir)')
    var res = new other.gp_Vec(create.gp_Dir());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('gp_Vec(gp_XYZ)', function(){
    // console.log('gp_Vec(gp_XYZ)')
    var res = new other.gp_Vec(create.gp_XYZ());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  it('gp_Vec(other.double, other.double, other.double)', function(){
    // console.log('gp_Vec(other.double, other.double, other.double)')
    var res = new other.gp_Vec(26, 26.5, 27);
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('gp_Vec(other.gp_Pnt, other.gp_Pnt)', function(){
    // console.log('gp_Vec(other.gp_Pnt, other.gp_Pnt)')
    var res = new other.gp_Vec(create.other.gp_Pnt(), create.other.gp_Pnt());
    var res_h = res._handle;
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });



  // arguments or return type not wrapped
  xit('setCoord(Standard_Integer, other.double)', function(){
    // console.log('setCoord(Standard_Integer, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.setCoord(create.Standard_Integer(), 27.5);
  });


  it('setCoord(other.double, other.double, other.double)', function(){
    // console.log('setCoord(other.double, other.double, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.setCoord(28, 28.5, 29);
  });


  it('setX(other.double)', function(){
    // console.log('setX(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.setX(29.5);
  });


  it('setY(other.double)', function(){
    // console.log('setY(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.setY(30);
  });


  it('setZ(other.double)', function(){
    // console.log('setZ(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.setZ(30.5);
  });


  // arguments or return type not wrapped
  xit('setXyz(gp_XYZ)', function(){
    // console.log('setXyz(gp_XYZ)')
    var obj = create.other.gp_Vec();
    var res = obj.setXyz(create.gp_XYZ());
  });


  // arguments or return type not wrapped
  xit('coord(Standard_Integer)', function(){
    // console.log('coord(Standard_Integer)')
    var obj = create.other.gp_Vec();
    var res = obj.coord(create.Standard_Integer());
    expect(typeof res).toBe('number');
  });


  it('coord(other.double, other.double, other.double)', function(){
    // console.log('coord(other.double, other.double, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.coord(31, 31.5, 32);
  });


  it('x()', function(){
    // console.log('x()')
    var obj = create.other.gp_Vec();
    var res = obj.x();
    expect(typeof res).toBe('number');
  });


  it('y()', function(){
    // console.log('y()')
    var obj = create.other.gp_Vec();
    var res = obj.y();
    expect(typeof res).toBe('number');
  });


  it('z()', function(){
    // console.log('z()')
    var obj = create.other.gp_Vec();
    var res = obj.z();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('xyz()', function(){
    // console.log('xyz()')
    var obj = create.other.gp_Vec();
    var res = obj.xyz();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });


  // arguments or return type not wrapped
  xit('isEqual(other.gp_Vec, other.double, other.double)', function(){
    // console.log('isEqual(other.gp_Vec, other.double, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.isEqual(create.other.gp_Vec(), 32.5, 33);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isNormal(other.gp_Vec, other.double)', function(){
    // console.log('isNormal(other.gp_Vec, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.isNormal(create.other.gp_Vec(), 33.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isOpposite(other.gp_Vec, other.double)', function(){
    // console.log('isOpposite(other.gp_Vec, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.isOpposite(create.other.gp_Vec(), 34);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('isParallel(other.gp_Vec, other.double)', function(){
    // console.log('isParallel(other.gp_Vec, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.isParallel(create.other.gp_Vec(), 34.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('Standard_Boolean');
  });


  // arguments or return type not wrapped
  xit('angle(other.gp_Vec)', function(){
    // console.log('angle(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.angle(create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('angleWithRef(other.gp_Vec, other.gp_Vec)', function(){
    // console.log('angleWithRef(other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.angleWithRef(create.other.gp_Vec(), create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  it('magnitude()', function(){
    // console.log('magnitude()')
    var obj = create.other.gp_Vec();
    var res = obj.magnitude();
    expect(typeof res).toBe('number');
  });


  it('squareMagnitude()', function(){
    // console.log('squareMagnitude()')
    var obj = create.other.gp_Vec();
    var res = obj.squareMagnitude();
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('add(other.gp_Vec)', function(){
    // console.log('add(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.add(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('added(other.gp_Vec)', function(){
    // console.log('added(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.added(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('subtract(other.gp_Vec)', function(){
    // console.log('subtract(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.subtract(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('subtracted(other.gp_Vec)', function(){
    // console.log('subtracted(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.subtracted(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  it('multiply(other.double)', function(){
    // console.log('multiply(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.multiply(35);
  });


  // arguments or return type not wrapped
  xit('multiplied(other.double)', function(){
    // console.log('multiplied(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.multiplied(35.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  it('divide(other.double)', function(){
    // console.log('divide(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.divide(36);
  });


  // arguments or return type not wrapped
  xit('divided(other.double)', function(){
    // console.log('divided(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.divided(36.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('cross(other.gp_Vec)', function(){
    // console.log('cross(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.cross(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('crossed(other.gp_Vec)', function(){
    // console.log('crossed(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.crossed(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('crossMagnitude(other.gp_Vec)', function(){
    // console.log('crossMagnitude(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.crossMagnitude(create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('crossSquareMagnitude(other.gp_Vec)', function(){
    // console.log('crossSquareMagnitude(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.crossSquareMagnitude(create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('crossCross(other.gp_Vec, other.gp_Vec)', function(){
    // console.log('crossCross(other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.crossCross(create.other.gp_Vec(), create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('crossCrossed(other.gp_Vec, other.gp_Vec)', function(){
    // console.log('crossCrossed(other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.crossCrossed(create.other.gp_Vec(), create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('dot(other.gp_Vec)', function(){
    // console.log('dot(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.dot(create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  // arguments or return type not wrapped
  xit('dotCross(other.gp_Vec, other.gp_Vec)', function(){
    // console.log('dotCross(other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.dotCross(create.other.gp_Vec(), create.other.gp_Vec());
    expect(typeof res).toBe('number');
  });


  it('normalize()', function(){
    // console.log('normalize()')
    var obj = create.other.gp_Vec();
    var res = obj.normalize();
  });


  // arguments or return type not wrapped
  xit('normalized()', function(){
    // console.log('normalized()')
    var obj = create.other.gp_Vec();
    var res = obj.normalized();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  it('reverse()', function(){
    // console.log('reverse()')
    var obj = create.other.gp_Vec();
    var res = obj.reverse();
  });


  // arguments or return type not wrapped
  xit('reversed()', function(){
    // console.log('reversed()')
    var obj = create.other.gp_Vec();
    var res = obj.reversed();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.double, other.gp_Vec, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.double, other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(37, create.other.gp_Vec(), 37.5, create.other.gp_Vec(), 38, create.other.gp_Vec(), create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.double, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.double, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(38.5, create.other.gp_Vec(), 39, create.other.gp_Vec(), 39.5, create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(40, create.other.gp_Vec(), 40.5, create.other.gp_Vec(), create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec, other.double, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(41, create.other.gp_Vec(), 41.5, create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.double, other.gp_Vec, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.double, other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(42, create.other.gp_Vec(), create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('setLinearForm(other.gp_Vec, other.gp_Vec)', function(){
    // console.log('setLinearForm(other.gp_Vec, other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.setLinearForm(create.other.gp_Vec(), create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('mirror(other.gp_Vec)', function(){
    // console.log('mirror(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.mirror(create.other.gp_Vec());
  });


  // arguments or return type not wrapped
  xit('mirrored(other.gp_Vec)', function(){
    // console.log('mirrored(other.gp_Vec)')
    var obj = create.other.gp_Vec();
    var res = obj.mirrored(create.other.gp_Vec());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('mirror(gp_Ax1)', function(){
    // console.log('mirror(gp_Ax1)')
    var obj = create.other.gp_Vec();
    var res = obj.mirror(create.gp_Ax1());
  });


  // arguments or return type not wrapped
  xit('mirrored(gp_Ax1)', function(){
    // console.log('mirrored(gp_Ax1)')
    var obj = create.other.gp_Vec();
    var res = obj.mirrored(create.gp_Ax1());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('mirror(example.gp_Ax2)', function(){
    // console.log('mirror(example.gp_Ax2)')
    var obj = create.other.gp_Vec();
    var res = obj.mirror(create.example.gp_Ax2());
  });


  // arguments or return type not wrapped
  xit('mirrored(example.gp_Ax2)', function(){
    // console.log('mirrored(example.gp_Ax2)')
    var obj = create.other.gp_Vec();
    var res = obj.mirrored(create.example.gp_Ax2());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('rotate(gp_Ax1, other.double)', function(){
    // console.log('rotate(gp_Ax1, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.rotate(create.gp_Ax1(), 42.5);
  });


  // arguments or return type not wrapped
  xit('rotated(gp_Ax1, other.double)', function(){
    // console.log('rotated(gp_Ax1, other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.rotated(create.gp_Ax1(), 43);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  it('scale(other.double)', function(){
    // console.log('scale(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.scale(43.5);
  });


  // arguments or return type not wrapped
  xit('scaled(other.double)', function(){
    // console.log('scaled(other.double)')
    var obj = create.other.gp_Vec();
    var res = obj.scaled(44);
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('transform(gp_Trsf)', function(){
    // console.log('transform(gp_Trsf)')
    var obj = create.other.gp_Vec();
    var res = obj.transform(create.gp_Trsf());
  });


  // arguments or return type not wrapped
  xit('transformed(gp_Trsf)', function(){
    // console.log('transformed(gp_Trsf)')
    var obj = create.other.gp_Vec();
    var res = obj.transformed(create.gp_Trsf());
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_Vec');
  });


  // arguments or return type not wrapped
  xit('csfdbGetgpVeccoord()', function(){
    // console.log('csfdbGetgpVeccoord()')
    var obj = create.other.gp_Vec();
    var res = obj.csfdbGetgpVeccoord();
    expect(typeof res).toBe('object');
    expect(res.constructor.name.replace('_exports_', '')).toBe('gp_XYZ');
  });

});
