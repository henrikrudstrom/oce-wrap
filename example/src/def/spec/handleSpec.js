var Geom = require('../lib/Geom.node');
var gp = require('../lib/gp.node');
function bla(ap){
  var ap2 = ap;
  return ap.translated(new gp.Vec(2, 3, 4))
}
describe('a handle', function() {
  it('it plays well with garbage collectors', function() {
    var handles = [];
    for (var i = 0; i < 55000; i++) {
      //console.log("hey")
      var ap1 = new Geom.Axis1Placement(new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1));
      //handles.push(ap1._handle)
      //handles.push(ap1.getHandle())
      //expect(ap1.getHandle().getObject().constructor.name).toBe('_exports_Axis1Placement');
      var ap2 = new Geom.Axis1Placement(new gp.Pnt(1, 1, 1), new gp.Dir(0, 1, 0));
      //handles.push(ap2._handle)
      //handles.push(ap2.getHandle())
      if(i % 500 === 0)
        console.log("ho"+i, ap1._handle)
      //console.log(ap2.getHandle())
      // for(var i in ap2.getHandle()){
      //   console.log(i)
      // }
      var r = ap2.axis()
      //ap1.handle = new Geom.Handle_Axis1Placement(ap1);
      ap1.translated(new gp.Vec(2, 3, 4))
      var k = bla(ap1);
      //handles.push(ap1.handle)

      //ap2.handle = new Geom.Handle_Axis1Placement(ap2);
      //handles.push(ap2.handle)
      var angle = ap1.angle(ap2._handle);
      //console.log(angle)
      var ap3 = ap1.translated(new gp.Vec(2, 3, 4));
      //handles.push(ap3)
      //var ap4 = ap1.mirrored(new gp.Pnt(3, 2, 1));
      //var angle2 = ap3.angle(ap4);
    }
  });
});
