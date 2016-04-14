var gp = require('./dist/lib/gp.node');
var Geom = require('./dist/lib/Geom.node');
var ax1 = new gp.Ax1(new gp.Pnt(1,2,3), new gp.Dir(1,2,3));
var axP = new Geom.Axis1Placement(ax1);
var ax12 = new gp.Ax1(new gp.Pnt(1,2,3), new gp.Dir(3,1,1));
var axP2 = new Geom.Axis1Placement(ax12);
console.log(axP.myValue);
var cp = axP.copy();
console.log("cp", cp.myValue);
console.log(cp.constructor.name);

var angle = axP.angle(axP2);
console.log(angle)