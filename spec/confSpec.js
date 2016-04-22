/*global expect */
const settings = require('../src/settings.js');
settings.initialize({
  paths: {
    build: 'spec/test-proj/build',
    dist: 'spec/test-proj/dist',
    definition: 'spec/test-proj/def'
  }
});
var headers = require('../src/headers.js');

require('../src/features/rename.js');
require('../src/features/property.js');
const conf = require('../src/conf.js');
var moduleReader = require('../src/modules.js');
var configure = require('../src/configure.js');

const render = require('../src/render.js');

describe('querie objects', function() {
  it('can query headers', function() {
    expect(headers.find('gp_Pnt').length).toBe(1);
    expect(headers.get('gp_Pnt').name).toBe('gp_Pnt');
    expect(headers.get('Geom_Point').name).toBe('Geom_Point');
    expect(headers.get('Handle_Geom_Point').name).toBe('Handle_Geom_Point');

    expect(headers.find('gp_Pnt::SetCoord').length).toBe(2);
    expect(headers.find('gp_Pnt::Set*').length).toBe(6);
    expect(headers.get('gp_Pnt::BaryCenter').name).toBe('BaryCenter');
    expect(headers.find('gp_Vec*').length).toBe(3);
    expect(headers.find('gp_Vec*WithNull*').length).toBe(1);
    expect(headers.find('gp_*::*Distance').length).toBe(22);
    expect(headers.find('gp_Vec::gp_Vec').length).toBe(5);
    expect(headers.find('gp_Vec::gp_Vec(gp_Vec)').length).toBe(0); // removed copy constructors
    expect(headers.find('gp_Vec::gp_Vec(*, *)').length).toBe(2);
    expect(headers.find('gp_Vec::gp_Vec(Standard_Real, Standard_Real, Standard_Real)').length).toBe(1);
    expect(headers.find('gp_Vec::gp_Vec(*)').length).toBe(5);
  });
});

describe('module object', function() {
  it('can include declared types', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.process();
    expect(mod.declarations[0].name).toBe('gp_Pnt');
    expect(mod.declarations.length).toBe(1);

    mod.exclude('gp_Vec');
    mod.process();
    expect(mod.declarations.length).toBe(1);
    mod.exclude('gp_Pnt');
    mod.include('gp_Vec*');
    mod.process();
    expect(mod.declarations.length).toBe(3);
    mod.exclude('gp_*WithNullMagnitude');
    mod.process();
    expect(mod.declarations.length).toBe(2);
  });
  xit('declarations are only included once', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.include('gp_Pnt');
    mod.process();
    expect(mod.get('gp_Pnt').name).toBe('gp_Pnt');
    expect(mod.find('*').length).toBe(1);
  });

  it('can include declared types', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.include('gp_Pnt');
    mod.process();
    expect(mod.declarations[0].name).toBe('gp_Pnt');
  });

  it('wrap defintions are mapped to the source', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.rename('gp_Pnt', 'Point');
    var pnt = mod.get('gp_Pnt');
    pnt.include('SetX');
    mod.process();
    expect(pnt.source().name).toBe('gp_Pnt');
    expect(pnt.get('SetX').source().name).toBe('SetX');
  });
  // it('deepcopies the object from the source', function() {
  //   var mod = new conf.Conf();
  //   mod.include('gp_Pnt');
  //   mod.process('include');
  //   var wrapped = mod.get('gp_Pnt');
  //   var orig = headers.get('gp_Pnt');
  //   expect(wrapped).not.toBe(orig);
  //   expect(wrapped.declarations[0]).not.toBe(orig.declarations[0]);
  //   expect(wrapped.declarations.length).toBe(orig.declarations.length);
  // });

  it('can rename declarations', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.find('gp_Pnt').include('*');
    mod.rename('gp_Pnt', 'Point');
    mod.process();
    expect(mod.get('gp_Pnt').name).toBe('Point');
    expect(mod.get('gp_Pnt').declarations[0].parent).toBe('Point');
  });
  it('renames childs parents', function() {

  })



  it('can rename before include', function() {
    var mod = new conf.Conf();
    mod.rename('gp_Vec', 'Vector');
    mod.include('gp_Vec');
    mod.process();
    expect(mod.get('gp_Vec').name).toBe('Vector');
  });
  it('only last is valid', function() {
    var mod = new conf.Conf();

    mod.include('gp_Vec*');
    mod.rename('gp_Vec*', 'Vector');
    mod.rename('gp_Vec2d', 'Vector2d');
    mod.process();
    expect(mod.get('gp_Vec').name).toBe('Vector');
    expect(mod.get('gp_Vec2d').name).toBe('Vector2d');
  });

  it('can pass a function', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec*');
    mod.rename('*', (n) => n + '_suffix');
    mod.process();
    expect(mod.get('gp_Vec').name).toBe('gp_Vec_suffix');
    expect(mod.get('gp_Vec2d').name).toBe('gp_Vec2d_suffix');
  });

  it('functions can be composed', function() {
    conf.Conf.prototype.testInclude = function(expr, name) {
      this.include(expr);
      this.rename(expr, name);
    };
    var mod = new conf.Conf();
    mod.testInclude('gp_Vec', 'Vector');
    mod.process();
    expect(mod.get('gp_Vec').name).toBe('Vector');
  });

  it('filter and rename members', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec');

    vec.exclude('*');
    mod.process();
    expect(mod.get('gp_Vec').declarations.length).toBe(0);
    expect(mod.get('gp_Vec')).toBe(vec);
    vec.include('SetX');
    expect(mod.get('gp_Vec').declarations.length).toBe(1);

    expect(mod.get('gp_Vec').get('SetX').name).toBe('SetX');

    vec.rename('SetX', 'setX');
    mod.process();
    expect(mod.get('gp_Vec').get('SetX').name).toBe('setX');
  });


  it('can query nested declarations', function() {
    var mod = new conf.Conf();
    mod.include('gp_*')
    mod.find('*')
      .include('*');
    mod.find('*').camelCase('*');
    mod.process();

    mod.find('gp_Vec::SetX');
    expect(mod.find('gp_Vec::SetX')[0].name).toBe('setX');

    expect(mod.find('gp_Vec::gp_Vec(*, *, *)').length).toBe(1);
    expect(mod.find('gp_Vec::gp_Vec(Standard_Real, Standard_Real, Standard_Real)').length).toBe(1);

  });

  it('can apply to many declarations', function() {
    var mod = new conf.Conf();
    var classes = mod.include('gp_*');
    mod.find('gp_*').exclude('*');
    mod.find('gp_Vec*').include('Set*');
    mod.process();
    expect(mod.get('gp_Pnt').declarations.length).toBe(0);
    expect(mod.get('gp_Vec').declarations.length).toBe(12);
    expect(mod.get('gp_Vec2d').declarations.length).toBe(9);

  });


  it('rename camel case', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec');
    vec.include('*');
    vec.camelCase('*');

    mod.process();
    expect(vec.find('SetY')[0].name).toBe('setY');
    expect(vec.find('Mirror')[0].name).toBe('mirror');
  });
  it('rename remove prefix', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    mod.include('Geom_Point');
    mod.include('Handle_Geom_Point');
    mod.removePrefix('*');

    mod.process();
    expect(mod.get('gp_Vec').name).toBe('Vec');
    expect(mod.get('Geom_Point').name).toBe('Point');
    expect(mod.get('Handle_Geom_Point').name).toBe('Handle_Point');
  });

  it('can define properties', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec')
      .include('*X')
      .camelCase('*')
      .property('X', 'SetX');
    mod.process();

    expect(vec.get('X').cls).toBe('property');
    expect(vec.get('X').name).toBe('x');
    expect(vec.get('X').type).toBe('Standard_Real');
    expect(vec.get('SetX')).toBe(null);
  });
  it('can define multiple properties', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    mod.include('gp_Pnt');
    mod.include('gp_Dir');
    mod.find('*')
      .include('*X')
    mod.find('*').camelCase('*')
    mod.find('*').property('X', 'SetX');
    mod.process();
    var vec = mod.get('gp_Vec');
    var pnt = mod.get('gp_Pnt');
    var dir = mod.get('gp_Dir');
    expect(vec.get('X').cls).toBe('property');
    expect(vec.get('X').name).toBe('x');
    expect(vec.get('X').type).toBe('Standard_Real');
    expect(vec.get('SetX')).toBe(null);
    expect(pnt.get('X').cls).toBe('property');
    expect(pnt.get('X').name).toBe('x');
    expect(pnt.get('X').type).toBe('Standard_Real');
    expect(pnt.get('SetX')).toBe(null);
    expect(dir.get('X').cls).toBe('property');
    expect(dir.get('X').name).toBe('x');
    expect(dir.get('X').type).toBe('Standard_Real');
    expect(dir.get('SetX')).toBe(null);
  });
  it('can define typemaps', function() {
    var mod = new conf.Conf();
    mod.name = 'gp'
    mod.include('gp_Vec');
    mod.include('gp_Pnt');
    var pnt = mod.get('gp_Pnt');
    pnt.include('SetXYZ');
    pnt.include('XYZ');
    mod.removePrefix('*');
    mod.typemap('gp_XYZ', 'gp_Vec', 'XYZ()');
    mod.process();
    configure.processModules(mod);
    expect(pnt.get('XYZ').returnType).toBe('gp.Vec');
    expect(pnt.get('SetXYZ').arguments[0].type).toBe('gp.Vec');

  });
  it('can handle argouts', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').camelCase('*');
    mod.removePrefix('*');

    mod.include('Geom_Geometry');
    mod.include('Geom_Surface');
    mod.include('Geom_ElementarySurface');
    mod.include('Geom_SphericalSurface');
    mod.find('*').include('*');
    mod.find('*').argoutArray('Bounds');
    mod.process();

    var method = mod.get('Geom_SphericalSurface').get('Bounds');
    expect(method.argouts.length).toBe(4);
    expect(method.arguments.length).toBe(0);
    expect(method.returnType).toBe('Array');
  });
  it('can hide handles', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').camelCase('*');
    mod.removePrefix('*');

    mod.include('Geom_Axis1Placement');
    mod.include('Geom_AxisPlacement');
    mod.find('*').include('*');
    mod.noHandle('Geom_*');
    mod.process();
    configure.processModules(mod);
    // adds the handle class
    expect(mod.declarations.length).toBe(4);
    var obj = mod.get('Geom_AxisPlacement');
    expect(obj.get('Angle').arguments[0].type).toBe('Geom.AxisPlacement');
  });

  it('can wrap GC_Make as static functions', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.depends('gp');
    mod.find('*').camelCase('*');
    mod.removePrefix('*');
    mod.include('Geom_Geometry');
    mod.include('Geom_Curve');
    mod.include('Geom_Conic');
    mod.include('Geom_Circle');
    mod.find('Geom_Circle').includeGCMake('GC_MakeCircle(*)');
    mod.noHandle('*');
    mod.process();
    configure.processModules(mod);

    var statics = mod.get('Geom_Circle').declarations.filter(decl => decl.cls === 'staticfunc');
    expect(statics.length).toBe(8);
    expect(statics[0].returnType).toBe('Geom.Circle');
    expect(statics[0].name).toBe('makeCircle');
    expect(statics[0].source()).not.toBe(null);
    expect(statics[0].source().name).toBe('GC_MakeCircle');
    expect(statics.every(s => s.returnType === 'Geom.Circle')).toBe(true);
  });
  it('can wrap BRepBuilder as module static functions', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').camelCase('*');

    mod.removePrefix('*');
    mod.include('Geom_Geometry');
    mod.include('Geom_Curve');

    mod.includeBRepBuilder('BRepBuilderAPI_MakeEdge(Handle_Geom_*)', 'Edge');
    mod.noHandle('*');
    mod.process();
    configure.processModules(mod);

    var statics = mod.find('BRepBuilderAPI_MakeEdge');
    expect(statics.length).toBe(6);
    // expect(statics[0].returnType).toBe('Geom.Circle');
    expect(statics[0].name).toBe('makeEdge');
    // expect(statics[0].source()).not.toBe(null);
    // expect(statics[0].source().name).toBe('GC_MakeCircle');
    // expect(statics.every(s => s.returnType === 'Geom.Circle')).toBe(true);
  });
});


describe('MultiConf', function() {
  it('behaves as a normal array', function() {
    var a = [1, 3, 5];
    conf.createMultiConf(a);
    expect(a[0]).toBe(1);
    expect(a[1]).toBe(3);
    var sum = a.reduce((k, b) => k + b);
    expect(sum).toBe(9);
    expect(typeof a.include).toBe('function');
    expect(typeof a.exclude).toBe('function');
  });
});

// describe('modules queries', function() {
//   it('can query wrapped modules', function() {
//     var mod1 = new conf.Conf();
//     mod1.name = 'gp';
//     mod1.include('gp_Pnt');
//     mod1.rename('gp_Pnt', 'Point');
//     mod1.process();
//     var mod2 = new conf.Conf();
//     mod2.name = 'Geom';
//     mod2.include('Geom_Point');
//     mod1.process();
//
//     var mods = moduleReader([mod1, mod2])
//
//     expect(mods.get('gp.Point').name).toBe('Point');
//     expect(mods.get('Geom.Geom_Point').name).toBe('Geom_Point');
//
//   });
// });
