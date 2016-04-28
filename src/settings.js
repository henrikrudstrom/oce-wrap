const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const glob = require('glob');

var generatorPath = path.join(__dirname, '..');

var defaultsettings = {
  paths: {
    build: 'build',
    dist: 'dist',
    definition: 'src',
    cache: 'cache',
    generator: generatorPath
  },
  oce: {
    include: '/usr/local/include/oce',
    lib: '/usr/local/lib',
    //used by header parser, determines which headers are parsed and cached
    parseToolkits: [
      'TKG3d', 'TKG2d', 'TKernel', 'TKMath', 'TKAdvTools',
      'TKGeomBase', 'TKBRep', 'TKPrim', 'TKGeomAlgo', 'TKTopAlgo'
    ]
  },
  xmlGenerator: 'gccxml',
  xmlGeneratorPath: '/usr/bin/gccxml',
  swig: 'swig'
};

function oceData(parseToolkits) {
  function readData(name, def) {
    var file = path.join(generatorPath, 'data', name);

    if (!fs.existsSync(file)) return def;
    return JSON.parse(fs.readFileSync(file));
  }

  const toolkits = readData('toolkits.json', []);
  const cannotParse = readData('cannot-parse.json', {});
  const depends = readData('depends.json', {});

  // remove dependencies that are excluded
  Object.keys(depends).forEach(function(dep) {
    depends[dep] = depends[dep].filter((d) => !cannotParse.modules.some((m) => m === d));
  });

  var modules = parseToolkits
    .map((tkName) => toolkits.find((tk) => tk.name === tkName).modules)
    .reduce((a, b) => a.concat(b))
    .filter((mod) => cannotParse.modules.indexOf(mod) === -1);

  var res = {
    toolkits,
    depends,
    modules
  };
  return res;
}


function initialize(settings) {
  var fileSettings = {};
  if (fs.existsSync('settings.json'))
    fileSettings = JSON.parse(fs.readFileSync('settings.json'));

  settings = extend(true, {}, defaultsettings, settings || {});
  extend(true, settings, fileSettings);

  settings.paths = extend({}, settings.paths, {
    swig: path.join(settings.paths.build, 'swig'),
    cxx: path.join(settings.paths.build, 'src'),
    inc: path.join(settings.paths.build, 'inc'),
    gyp: path.join(settings.paths.build, 'gyp'),
    config: path.join(settings.paths.build, 'config'),
    headerCache: 'cache/headers',
    data: path.join(settings.paths.generator, 'data')
  });

  settings.oce = extend(settings.oce, oceData(settings.oce.parseToolkits));
  settings.build = {
    modules: glob.sync(`${settings.paths.definition}/modules/*.js`)
      .map((file) => path.basename(file).replace('.js', ''))
  };
  
  if (yargs.argv.module)
    settings.build.modules = yargs.argv.module.split(',');
  if (yargs.argv.modules)
    settings.build.modules = yargs.argv.modules.split(',');
  module.exports = settings;

  module.exports.initialize = function() {
    console.log('Warning: settings already initialized');
  };

  return settings;
}

module.exports.initialize = initialize;
