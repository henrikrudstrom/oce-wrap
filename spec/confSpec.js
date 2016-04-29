var expect = require('chai').expect;

const settings = require('../src/settings.js');
settings.initialize();

const headers = require('../src/headers.js');
const conf = require('../src/conf.js');
const configure = require('../src/configure.js');


describe('querie objects', function() {
  it('can query headers', function() {
    expect(headers.find('gp_Pnt').length).to.equal(1);
    expect(headers.get('gp_Pnt').name).to.equal('gp_Pnt');
    expect(headers.get('Geom_Point').name).to.equal('Geom_Point');
    expect(headers.get('Handle_Geom_Point').name).to.equal('Handle_Geom_Point');
    expect(headers.find('gp_Pnt::SetCoord').length).to.equal(2);
    expect(headers.find('gp_Pnt::Set*').length).to.equal(6);
    expect(headers.get('gp_Pnt::BaryCenter').name).to.equal('BaryCenter');
    expect(headers.find('gp_Vec*').length).to.equal(3);
    expect(headers.find('gp_Vec*WithNull*').length).to.equal(1);
    expect(headers.find('gp_*::*Distance').length).to.equal(22);
    expect(headers.find('gp_Vec::gp_Vec').length).to.equal(5);
    expect(headers.find('gp_Vec::gp_Vec(gp_Vec)').length).to.equal(0); // removed copy constructors
    expect(headers.find('gp_Vec::gp_Vec(*, *)').length).to.equal(2);
    expect(headers.find('gp_Vec::gp_Vec(Standard_Real, Standard_Real, Standard_Real)').length).to.equal(1);
    expect(headers.find('gp_Vec::gp_Vec(*)').length).to.equal(5);
  });
});


describe('module object', function() {
  it('can include declared types', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.process();
    expect(mod.declarations[0].name).to.equal('gp_Pnt');
    expect(mod.declarations.length).to.equal(1);

    mod.exclude('gp_Vec');
    mod.process();
    expect(mod.declarations.length).to.equal(1);
    
    mod.exclude('gp_Pnt');
    mod.include('gp_Vec*');
    mod.process();
    expect(mod.declarations.length).to.equal(3);
    
    mod.exclude('gp_*WithNullMagnitude');
    mod.process();
    expect(mod.declarations.length).to.equal(2);
  });


  it('can include declared types', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.include('gp_Pnt');
    mod.process();
    expect(mod.declarations[0].name).to.equal('gp_Pnt');
  });


  it('wrap defintions are mapped to the source', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.rename('gp_Pnt', 'Point');
    var pnt = mod.get('gp_Pnt');
    pnt.include('SetX');
    mod.process();

    expect(pnt.origName).to.equal('gp_Pnt');
    expect(pnt.get('SetX').origName).to.equal('SetX');
  });


  it('can rename declarations', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.find('gp_Pnt').include('*');
    mod.rename('gp_Pnt', 'Point');
    mod.process();
    expect(mod.get('gp_Pnt').name).to.equal('Point');
    expect(mod.get('gp_Pnt').declarations[0].parent).to.equal('Point');
  });


  it('can rename before include', function() {
    var mod = new conf.Conf();
    mod.rename('gp_Vec', 'Vector');
    mod.include('gp_Vec');
    mod.process();
    expect(mod.get('gp_Vec').name).to.equal('Vector');
  });
  
  
  it('only last is valid', function() {
    var mod = new conf.Conf();

    mod.include('gp_Vec*');
    mod.rename('gp_Vec*', 'Vector');
    mod.rename('gp_Vec2d', 'Vector2d');
    mod.process();
    expect(mod.get('gp_Vec').name).to.equal('Vector');
    expect(mod.get('gp_Vec2d').name).to.equal('Vector2d');
  });


  it('can pass a function', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec*');
    mod.rename('*', (n) => n + '_suffix');
    mod.process();
    expect(mod.get('gp_Vec').name).to.equal('gp_Vec_suffix');
    expect(mod.get('gp_Vec2d').name).to.equal('gp_Vec2d_suffix');
  });


  it('functions can be composed', function() {
    conf.Conf.prototype.testInclude = function(expr, name) {
      this.include(expr);
      this.rename(expr, name);
    };
    var mod = new conf.Conf();
    mod.testInclude('gp_Vec', 'Vector');
    mod.process();
    expect(mod.get('gp_Vec').name).to.equal('Vector');
  });


  it('filter and rename members', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec');

    vec.exclude('*');
    mod.process();
    expect(mod.get('gp_Vec').declarations.length).to.equal(0);
    expect(mod.get('gp_Vec')).to.equal(vec);
    vec.include('SetX');
    expect(mod.get('gp_Vec').declarations.length).to.equal(1);

    expect(mod.get('gp_Vec').get('SetX').name).to.equal('SetX');

    vec.rename('SetX', 'setX');
    mod.process();
    expect(mod.get('gp_Vec').get('SetX').name).to.equal('setX');
  });


  it('can query nested declarations', function() {
    var mod = new conf.Conf();
    mod.include('gp_*')
    mod.find('*')
      .include('*');
    mod.find('*').renameCamelCase('*');
    mod.process();

    mod.find('gp_Vec::SetX');
    expect(mod.find('gp_Vec::SetX')[0].name).to.equal('setX');

    expect(mod.find('gp_Vec::gp_Vec(*, *, *)').length).to.equal(1);
    expect(mod.find('gp_Vec::gp_Vec(Standard_Real, Standard_Real, Standard_Real)').length).to.equal(1);

  });


  it('can apply to many declarations', function() {
    var mod = new conf.Conf();
    var classes = mod.include('gp_*');
    mod.find('gp_*').exclude('*');
    mod.find('gp_Vec*').include('Set*');
    mod.process();
    expect(mod.get('gp_Pnt').declarations.length).to.equal(0);
    expect(mod.get('gp_Vec').declarations.length).to.equal(12);
    expect(mod.get('gp_Vec2d').declarations.length).to.equal(9);

  });


  it('rename camel case', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec');
    vec.include('*');
    vec.renameCamelCase('*');

    mod.process();
    expect(vec.find('SetY')[0].name).to.equal('setY');
    expect(vec.find('Mirror')[0].name).to.equal('mirror');
  });
  
  
  it('rename remove prefix', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    mod.include('Geom_Point');
    mod.include('Handle_Geom_Point');
    mod.removePrefix('*');

    mod.process();
    expect(mod.get('gp_Vec').name).to.equal('Vec');
    expect(mod.get('Geom_Point').name).to.equal('Point');
    expect(mod.get('Handle_Geom_Point').name).to.equal('Handle_Point');
  });


  it('can define properties', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    var vec = mod.get('gp_Vec')
      .include('*X')
      .renameCamelCase('*')
      .property('X', 'SetX');
    mod.process();

    expect(vec.get('X').declType).to.equal('property');
    expect(vec.get('X').name).to.equal('x');
    expect(vec.get('X').type).to.equal('Standard_Real');
    expect(vec.get('SetX')).to.equal(null);
  });
  
  
  it('can define multiple properties', function() {
    var mod = new conf.Conf();
    mod.include('gp_Vec');
    mod.include('gp_Pnt');
    mod.include('gp_Dir');
    mod.find('*')
      .include('*X')
    mod.find('*').renameCamelCase('*');
    mod.find('*').property('X', 'SetX');
    mod.process();
    var vec = mod.get('gp_Vec');
    var pnt = mod.get('gp_Pnt');
    var dir = mod.get('gp_Dir');
    expect(vec.get('X').declType).to.equal('property');
    expect(vec.get('X').name).to.equal('x');
    expect(vec.get('X').type).to.equal('Standard_Real');
    expect(vec.get('SetX')).to.equal(null);
    expect(pnt.get('X').declType).to.equal('property');
    expect(pnt.get('X').name).to.equal('x');
    expect(pnt.get('X').type).to.equal('Standard_Real');
    expect(pnt.get('SetX')).to.equal(null);
    expect(dir.get('X').declType).to.equal('property');
    expect(dir.get('X').name).to.equal('x');
    expect(dir.get('X').type).to.equal('Standard_Real');
    expect(dir.get('SetX')).to.equal(null);
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
    expect(pnt.get('XYZ').returnType).to.equal('gp.Vec');
    expect(pnt.get('SetXYZ').arguments[0].type).to.equal('gp.Vec');
  });
  
  
  it('can handle argouts', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').renameCamelCase('*');
    mod.removePrefix('*');

    mod.include('Geom_Geometry');
    mod.include('Geom_Surface');
    mod.include('Geom_ElementarySurface');
    mod.include('Geom_SphericalSurface');
    mod.find('*').include('*');
    mod.find('*').argoutObject('Bounds');
    mod.process();

    var method = mod.get('Geom_SphericalSurface').get('Bounds');
    var argouts = method.arguments.filter(arg => arg.outArg);
    expect(argouts.length).to.equal(4);
    //expect(method.arguments.length).to.equal(0);
    expect(method.returnType).to.equal('Object');
  });
  
  
  it('can hide handles', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').renameCamelCase('*');
    mod.removePrefix('*');

    mod.include('Geom_Axis1Placement');
    mod.include('Geom_AxisPlacement');
    mod.find('*').include('*');
    mod.noHandle('Geom_*');
    mod.process();
    configure.processModules(mod);
    // adds the handle class
    expect(mod.declarations.length).to.equal(4);
    var obj = mod.get('Geom_AxisPlacement');
    expect(obj.get('Angle').arguments[0].type).to.equal('Geom.AxisPlacement');
  });


  it('can wrap GC_Make as static functions', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.depends('gp');
    mod.find('*').renameCamelCase('*');
    mod.removePrefix('*');
    mod.include('Geom_Geometry');
    mod.include('Geom_Curve');
    mod.include('Geom_Conic');
    mod.include('Geom_Circle');
    mod.find('Geom_Circle').includeGCMake('GC_MakeCircle(*)');
    mod.noHandle('*');
    mod.process();
    configure.processModules(mod);

    var statics = mod.get('Geom_Circle').declarations.filter(decl => decl.declType === 'staticfunc');
    expect(statics.length).to.equal(8);
    expect(statics[0].returnType).to.equal('Geom.Circle');
    expect(statics[0].name).to.equal('makeCircle');
    //expect(statics[0].source()).not.to.equal(null);
    //expect(statics[0].source().name).to.equal('GC_MakeCircle');
    expect(statics.every(s => s.returnType === 'Geom.Circle')).to.equal(true);
  });
  
  
  it('can wrap BRepBuilder as module static functions', function() {
    var mod = new conf.Conf();
    mod.name = 'Geom';
    mod.find('*').renameCamelCase('*');

    mod.removePrefix('*');
    mod.include('Geom_Geometry');
    mod.include('Geom_Curve');

    mod.includeBRepBuilder('BRepBuilderAPI_MakeEdge(Handle_Geom_*)', 'Edge');
    mod.noHandle('*');
    mod.process();
    configure.processModules(mod);

    var statics = mod.find('BRepBuilderAPI_MakeEdge');
    expect(statics.length).to.equal(6);
    // expect(statics[0].returnType).to.equal('Geom.Circle');
    expect(statics[0].name).to.equal('makeEdge');
    // expect(statics[0].source()).not.to.equal(null);
    // expect(statics[0].source().name).to.equal('GC_MakeCircle');
    // expect(statics.every(s => s.returnType === 'Geom.Circle')).to.equal(true);
  });


  it('can extend objects', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt');
    mod.include('gp_Vec');
    mod.include('gp_Vec2d');
    mod.find('*').include('SetX');
    mod.find('*').include('SetY');
    var pnt = mod.get('gp_Pnt').extend({ foo: 'bar' })
    expect(pnt.foo).to.equal('bar');
    mod.find('gp_*').extend({ bar: 'foo' });
    expect(pnt.bar).to.equal('foo');
    expect(pnt.bar).to.equal('foo');

    pnt.get('SetX').extend({ bar: 'foo' });
    expect(pnt.get('SetX').bar).to.equal('foo');

    pnt.find('*').extend({ foo: 'bar' });
    expect(pnt.get('SetX').foo).to.equal('bar');
  });


  it('can query multiple expressions', function() {
    var mod = new conf.Conf();
    mod.include('gp_Pnt|gp_Vec*|gp_Trsf');
    expect(mod.declarations.length).to.equal(4);
  });
});


describe('MultiConf', function() {
  it('behaves as a normal array', function() {
    var a = [1, 3, 5];
    conf.createMultiConf(a);
    expect(a[0]).to.equal(1);
    expect(a[1]).to.equal(3);
    var sum = a.reduce((k, b) => k + b);
    expect(sum).to.equal(9);
    expect(typeof a.include).to.equal('function');
    expect(typeof a.exclude).to.equal('function');
  });
});

