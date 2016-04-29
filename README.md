[![Code Climate](https://codeclimate.com/github/henrikrudstrom/oce-wrap/badges/gpa.svg)](https://codeclimate.com/github/henrikrudstrom/oce-wrap)


#oce-wrap
##create modular node.js wrappers for OpenCascade Solid Modelling library

oce-wrap can easily generate a c++ to node.js wrapper for OpenCascade, a 3D solid modelling 
kernel. It is configurable to allow wrapping of selected classes and methods, and 
automatically generates code to eliminate c++ artifacts in the api (handles, outvales etc.)

A simple hypothetical module can be defined like this: (or take a look at [noce-dev](https://github.com/henrikrudstrom/noce-dev)
```javascript
module.exports = function(mod) {
  mod.name = 'Geom';

  // include classes
  mod.include('gp_Pnt');
  mod.include('gp_Vec');
  mod.include('Geom_Geometry');
  mod.include('Geom_Curve');
  mod.include('Geom_BoundedCurve');
  mod.include('Geom_BezierCurve');
  
  // define properties
  mod.find('gp_*')
    .property('X', 'SetX')
    .property('Y', 'SetY')
    .property('Z', 'SetZ')

  // include all members of all classes
  // except the delete() method.
  mod.find('*')
    .include('*')
    .exclude('delete()');
};
```

The aim is to automatically generate wrappers that hide the ugly implementation details and restructuring the api to be more human friendly. Features currently implemented:

**Handles are taken care of automatically:**
```javascript
> var circle = new Geom.Circle(ax, r);
> var trimmed = new Geom.TrimmedCurve(circle, 0, Math.PI / 2);
```
**Method pairs can be defined as properties:**
```javascript
> var pnt = new gp.Pnt(1,2,3);
> pnt.z
3
```
**converts output arguments to return values / objects**
```javascript
> var plane = new Geom.CylindricalSurface(ax, 10)
> circle.bounds()
{ u1: 0, u2: 1, v1: 0, v2: 1 }
```
**collection classes mapped to javascript arrays / objects**
```javascript
> new Geom.BezierCurve([new gp.Pnt(1,2,3), new gp.Pnt(2,3,4), new gp.Pnt(4,5,6)
```



##dependencies:
* node.js
* python 2.x
* gccxml or castxml
* pygccxml
* swig 3.x (latest from git)
* OCE 0.16 (not tested on 0.17)

##installation
1. install dependencies
2.
```
npm install -g gulp
npm install
```

3. Edit settings.js and example/settings.js
Set paths to OCE headers and
If you have castxml (ubuntu 15.0) use these settings:
```
  "xmlGenerator":  "castxml",
  "xmlGeneratorPath": "/usr/bin/castxml"
```
With gccxml:
```
  "xmlGenerator":  "gccxml",
  "xmlGeneratorPath": "/usr/bin/gccxml"
```

##Test it:
```
cd example
gulp init
gulp build
gulp test
```
##Goal
Create a lightweight unopinionated wrapper for core modelling functionality of open cascade.


TODOS:

Eliminate handles
all collection classes as js lists
convert one shot classes to static functions
strip away as many internal classes as possible.
