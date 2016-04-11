describe('gp.Pnt', function() {
  it('Pnt()', function() {
    // my test
    var res = new gp.Pnt();
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });


  it('Pnt(gp.XYZ)', function() {
    // my test
    var res = new gp.Pnt(create.gp.XYZ());
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });


  it('Pnt(gp.double,gp.double,gp.double)', function() {
    // my test
    var res = new gp.Pnt(0.5, 1, 1.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });
});
describe('gp.Vec', function() {
  it('Vec()', function() {
    var res = new gp.Pnt();
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });


  it('Vec(gp.XYZ)', function() {
    var res = new gp.Pnt(create.gp.XYZ());
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });


  it('Vec(gp.double,gp.double,gp.double)', function() {
    var res = new gp.Pnt(0.5, 1, 1.5);
    expect(typeof res).toBe('object');
    expect(res.constructor.name).toBe('Pnt');
  });
});
//end
