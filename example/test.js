var gp = require('./dist/lib/gp.node');
var Geom = require('./dist/lib/Geom.node');
var ax1 = new gp.Ax1(new gp.Pnt(1,2,3), new gp.Dir(1,2,3));
var axP = new Geom.Axis1Placement(ax1);
var cp = axP.copy();