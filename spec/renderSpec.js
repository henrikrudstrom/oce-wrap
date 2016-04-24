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
const render = require('../src/render.js');

const testsFeature = require('../src/features/tests.js');
const configure = require('../src/configure.js');
const glob = require('glob');
const modules = require('../src/modules');
const execSync = require('child_process').execSync;

xdescribe('Swig Renderer', function() {
  var features = ['rename', 'property'].map((name) =>
    require(`../src/features/${name}.js`)
  );

  it('can render a module', function() {
    var mod = new conf.Conf();
    mod.name = 'gp';
    var res = render('renderSwig', mod);

    var src = res.get('module.i');

    expect(src.indexOf('%include "renames.i"')).not.toBe(-1);
  });

  // it('can render renames', function() {
  //   var mod = new conf.Conf();
  //   mod.name = 'gp';
  //   mod.include('gp_Vec');
  //   mod.include('gp_Vec2d');
  //   mod.rename('gp_Vec*', 'Vector');
  //   mod.rename('gp_Vec2d', 'Vector2d');

  //   var res = mod.get('gp_Vec2d')
  //     .include('SetX')
  //     .rename('SetX', 'setX');

  //   mod.process();
  //   var parts = render(mod);

  //   var res = [
  //     '%rename("Vector") gp_Vec;',
  //     '%rename("Vector2d") gp_Vec2d;',
  //     '%rename("setX") gp_Vec2d::SetX;'
  //   ];
  //   expect(parts.rename.length).toBe(3);
  //   expect(parts.rename).toEqual(res);
  // });

  // it('can render properties', function(){
  //   var mod = new conf.Conf();
  //   mod.name = 'gp';
  //   mod.include('gp_Vec');
  //   mod.get('gp_Vec')
  //     .include('X')
  //     .include('SetX')
  //     .rename('X', 'x')
  //     .property('X', 'SetX')
  //   mod.process();

  //   var parts = render(mod);
  //   var res = ['%attribute(gp_Vec, Standard_Real, x, X, SetX);']
  //   expect(parts.property).toEqual(res);
  // });
});


describe('render tests', function() {
  var createValue = testsFeature.createValue;
  beforeEach(function() {
    execSync(`rm -rf ${settings.paths.config}`);
    const definedModules = glob.sync(`${settings.paths.definition}/modules/*.js`);
    configure(definedModules, settings.paths.config);
  });
  it('can create values', function() {
    expect(createValue('Integer')).toBe(1);
    expect(createValue('Double')).toBe('0.5');
    expect(createValue('Boolean')).toBe('true');
    expect(createValue('other.Vec')).toBe('create.other.Vec()');
  });
  it('can render tests', function(){
    const configuredModules = glob.sync(`${settings.paths.config}/*.json`);
    var res = render('renderTest', configuredModules);
    render.write(settings.paths.dist + '/test', res);

  })
});
