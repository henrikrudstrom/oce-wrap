var Geom = require('../lib/handle.node');
var gp = require('../lib/gp.node');

describe('a handle', function() {
  it('it plays well with garbage collectors', function() {
    var handles = [];
    for (var i = 0; i < 10000; i++) {
      console.log("hey")
      var ap1 = new Geom.Handle_Geom_Axis1Placement(new gp.Pnt(1, 1, 1), new gp.Dir(0, 0, 1));
      //handles.push(ap1.getHandle())
      //expect(ap1.getHandle().getObject().constructor.name).toBe('_exports_Axis1Placement');
      var ap2 = new Geom.Handle_Geom_Axis1Placement(new gp.Pnt(1, 1, 1), new gp.Dir(0, 1, 0));
      //handles.push(ap2.getHandle())
      console.log("ho"+i)
      //console.log(ap2.getHandle())
      // for(var i in ap2.getHandle()){
      //   console.log(i)
      // }
      var r = ap2.Reversed()
      //var angle = ap1.angle(ap2);
      //console.log(angle)
      //var ap3 = ap1.translated(new gp.Vec(2, 3, 4));
      //var ap4 = ap1.mirrored(new gp.Pnt(3, 2, 1));
      //var angle2 = ap3.angle(ap4);
    }
  });
});
