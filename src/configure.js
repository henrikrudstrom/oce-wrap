require('./features/rename.js');
require('./features/depends.js');
require('./features/property.js');
require('./features/argout.js');
require('./features/noHandle.js');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const path = require('path');
const arrify = require('arrify');
const settings = require('./settings.js');
var conf = require('./conf.js');
var createTypeDict = require('./typedict.js')


function configureModule(file) {
  file = path.relative(__dirname, file);
  var config = require(file);

  var mod = new conf.Conf();
  config(mod);

  if (!mod.name)
    throw new Error('Configuration Error: module name must be specified.');
  return mod;
}


function translateTypes(mods) {
  var typedict = createTypeDict(mods);
  mods.forEach(mod => {
    mod.declarations.forEach(cls =>
      (cls.bases || []).forEach(base => (base.name = typedict(base.name)))
    );


    //mod.declarations.map((decl) => (decl.bases ? decl.bases : []).forEach((base) => base.name = typedict(base.name))

    mod.declarations.map(
        (decl) => (decl.declarations ? decl.declarations : [])
      )
      .reduce((a, b) => a.concat(b), [])
      .forEach(
        (mem) => {
          if (mem.returnType)
            mem.returnType = typedict(mem.returnType);
          if (mem.type)
            mem.type = typedict(mem.type);
          if (mem.arguments)
            mem.arguments.forEach((arg) => {
              delete arg.decl;
              arg.type = typedict(arg.type);
            });
        }
      );
  });
}

function processModules(mods) {
  mods = arrify(mods);
  mods.forEach(mod => {
    mod.rename('Standard_Real', 'double');
    mod.rename('Standard_Integer', 'int');
    mod.rename('Standard_Boolean', 'bool');
    mod.rename('Standard_CString', 'string');
    mod.process();
  });
  translateTypes(mods);
}

function configure(configurationFiles, outputPath) {
  var mods = configurationFiles.map(configureModule).filter(mod => mod !== null);
  processModules(mods);

  mods.forEach((mod) => {
    delete mod.stacks;
    mod.declarations.forEach((decl) => delete decl.stacks);
    var destFile = `${outputPath}/${mod.name}.json`;
    mkdirp.sync(path.dirname(destFile));
    fs.writeFileSync(destFile, JSON.stringify(mod, null, 2));
  });
}

module.exports = configure;
module.exports.translateTypes = translateTypes;
module.exports.processModules = processModules;
