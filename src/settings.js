const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const extend = require('extend');
const glob = require('glob');

var generatorPath = path.join(__dirname, '..');

var defaultOptions = {
  paths: {
    build: 'build',
    dist: 'dist',
    definition: 'src/def',
    cache: 'cache',
    generator: generatorPath
  },
  oce: {
    include: '/usr/local/include/oce',
    lib: '/usr/local/lib',
    parseToolkits: ['TKG3d', 'TKG2d', 'TKernel', 'TKMath', 'TKAdvTools',
      'TKGeomBase', 'TKBRep', 'TKGeomAlgo', 'TKTopAlgo'
    ]
  },
  xmlGenerator: 'gccxml',
  xmlGeneratorPath: '/usr/bin/gccxml'
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


function initialize(options) {
  if (module.exports.paths !== undefined)
    console.log('Warning: Settings already initialized');

  var fileSettings = {};
  if (fs.existsSync('settings.json'))
    fileSettings = JSON.parse(fs.readFileSync('settings.json'));

  options = extend(true, {}, defaultOptions, options || {});
  extend(true, options, fileSettings);

  module.exports.paths = extend({}, options.paths, {
    swig: path.join(options.paths.build, 'swig'),
    cxx: path.join(options.paths.build, 'cxx'),
    config: path.join(options.paths.build, 'config'),
    headerCache: path.join(options.paths.generator, 'cache/headers'),
    data: path.join(options.paths.generator, 'data')
  });
  
  module.exports.oce = extend(options.oce, oceData(options.oce.parseToolkits));
}

module.exports.initialize = initialize;
