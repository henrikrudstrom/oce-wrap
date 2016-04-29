const expect = require('chai').expect;

const settings = require('../src/settings.js');
settings.initialize();

var headers = require('../src/headers.js');
const conf = require('../src/conf.js');
const configure = require('../src/configure.js');
const moduleReader = require('../src/modules.js');
const depend = require('../src/dependencies.js');


describe('classDepends', function() {
  beforeEach(function() {
    var mod1 = new conf.Conf();
    mod1.name = 'gp';
    mod1.include('gp_*');
    mod1.find('gp_*').include('*');
    mod1.removePrefix('*');
    mod1.process();
    configure.processModules([mod1]);
    this.mod = mod1;
  })

  it('can process source dependencies', function() {
    var reader = depend(headers);
    var deps = reader.classDepends(headers.get('gp_Pnt'));
    var res = [
      'gp_XYZ', 'Standard_Real', 'Standard_Integer',
      'Standard_Boolean', 'gp_Ax1', 'gp_Ax2', 'gp_Trsf', 'gp_Vec'
    ];
    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });

  it('can process wrapped dependencies', function() {
    var modules = moduleReader([this.mod]);
    var pnt = modules.get('gp.Pnt');
    var reader = depend(modules);
    var deps = reader.classDepends(pnt);
    var res = [
      'gp.XYZ', 'Double', 'Integer',
      'Boolean', 'gp.Ax1', 'gp.Ax2', 'gp.Trsf', 'gp.Vec'
    ];
    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });

  it('can process recursive wrapped dependencies', function() {
    var modules = moduleReader([this.mod]);
    var pnt = modules.get('gp.Pnt');
    var reader = depend(modules);
    var deps = reader.classDepends(pnt, { recursive: true });
    var res = [
      'gp.Ax1', 'gp.Ax2', 'gp.Ax2d', 'gp.Ax3', 'gp.Dir', 'gp.Dir2d',
      'gp.EulerSequence', 'gp.Mat', 'gp.Mat2d', 'gp.Pnt2d', 'gp.Quaternion',
      'gp.Trsf', 'gp.Trsf2d', 'gp.TrsfForm', 'gp.Vec', 'gp.Vec2d', 'gp.XY',
      'gp.XYZ', 'Boolean', 'Double', 'Integer'
    ];
    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });
  xit('can process recursive wrapped source dependencies', function() {
    var modules = moduleReader([this.mod]);
    var pnt = modules.get('gp.Pnt');
    var reader = depend(modules);
    var deps = reader.classDepends(pnt, { recursive: true, source: true });
    var res = [
      'gp_Ax1', 'gp_Ax2', 'gp_Ax2d', 'gp_Ax3', 'gp_Dir', 'gp_Dir2d',
      'gp_EulerSequence', 'gp_Mat', 'gp_Mat2d', 'gp_Pnt2d', 'gp_Quaternion',
      'gp_Trsf', 'gp_Trsf2d', 'gp_TrsfForm', 'gp_Vec', 'gp_Vec2d', 'gp_XY',
      'gp_XYZ', 'Standard_Boolean', 'Standard_Real', 'Standard_Integer'
    ];
    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });
  it('can process recursive dependencies', function() {
    var reader = depend(headers);
    var point = headers.get('Geom_Point');
    var deps = reader.classDepends(point, { recursive: true });
    var res = [
      'Standard_Real', 'gp_Pnt', 'Handle_Geom_Point', 'Handle_Standard_Type',
      'gp_XYZ', 'Standard_Integer', 'Standard_Boolean', 'gp_Ax1', 'gp_Ax2', 'gp_Trsf',
      'gp_Vec', 'gp_Mat', 'gp_Dir', 'gp_Trsf2d', 'gp_Quaternion', 'gp_Ax3',
      'gp_TrsfForm', 'gp_Pnt2d', 'gp_Ax2d', 'gp_Vec2d', 'gp_XY', 'gp_Mat2d', 'gp_Dir2d',
      'gp_EulerSequence', 'Handle_Standard_Transient', 'Standard_Transient',
      'Standard_OStream', 'Standard_CString', 'Standard_Type', 'Standard_Address'
    ];

    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });
  it('can process recursive dependencies', function() {
    var reader = depend(headers);
    var point = headers.get('Geom_Point');
    var deps = reader.classDepends(point, { recursive: true });
    var res = [
      'Standard_Real', 'gp_Pnt', 'Handle_Geom_Point', 'Handle_Standard_Type',
      'gp_XYZ', 'Standard_Integer', 'Standard_Boolean', 'gp_Ax1', 'gp_Ax2', 'gp_Trsf',
      'gp_Vec', 'gp_Mat', 'gp_Dir', 'gp_Trsf2d', 'gp_Quaternion', 'gp_Ax3',
      'gp_TrsfForm', 'gp_Pnt2d', 'gp_Ax2d', 'gp_Vec2d', 'gp_XY', 'gp_Mat2d', 'gp_Dir2d',
      'gp_EulerSequence', 'Handle_Standard_Transient', 'Standard_Transient',
      'Standard_OStream', 'Standard_CString', 'Standard_Type', 'Standard_Address'
    ];

    res.sort();
    deps.sort();
    expect(deps).to.eql(res);
  });
});
