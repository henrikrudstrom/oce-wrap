describe('gp.Trsf', function() {
  it('translationPart()', function() {
    var obj = create.gp.Trsf();
    obj.setTranslation(new gp.Vec(1, 2, 3));
    var res = obj.translationPart();


    expect(typeof res).toBe('object');
    expect(obj.constructor.name).toBe('XYZ');
  });
  it('getRotation(gp.XYZ,gp.double)', function() {
    var obj = create.gp.Trsf();
    var res = obj.getRotation(create.gp.XYZ(), 54);
    expect(typeof res).toBe('boolean');
  });
});
describe('gp.Dir', function() {
  it('cross(gp.Dir)', function() {
    var obj = new gp.Dir(1,0,0);
    var res = obj.cross(new gp.Dir(0,1,0));

  });


  it('crossed(gp.Dir)', function() {
    var obj = new gp.Dir(1,0,0);
    var res = obj.crossed(new gp.Dir(0,1,0));


    expect(typeof res).toBe('object');
    expect(obj.constructor.name).toBe('Dir');
  });


  it('crossCross(gp.Dir,gp.Dir)', function() {
    var obj = new gp.Dir(1,0,0);
    var res = obj.crossCross(new gp.Dir(1,0,0), new gp.Dir(0,0,1));

  });


  it('crossCrossed(gp.Dir,gp.Dir)', function() {
    var obj = new gp.Dir(1,0,0);
    var res = obj.crossCrossed(new gp.Dir(1,0,0), new gp.Dir(0,0,1));


    expect(typeof res).toBe('object');
    expect(obj.constructor.name).toBe('Dir');
  });
});
describe();
