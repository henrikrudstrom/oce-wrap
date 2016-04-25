const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const arrify = require('arrify');

const conf = require('./conf.js');
const createTypeDict = require('./typedict.js');
const features = require('./features.js');
features.load();

function configureModule(file) {
  file = path.relative(__dirname, file);
  var config = require(file);

  var mod = new conf.Conf();
  config(mod);

  if (!mod.name)
    throw new Error('Configuration Error: module name must be specified.');
  return mod;
}

function memberTranslate(typedict) {
  return mem => {
    if (mem.returnType)
      mem.returnType = typedict(mem.returnType);
    
    if (mem.type)
      mem.type = typedict(mem.type);
    
    if (mem.arguments)
      mem.arguments.forEach((arg) => {
        delete arg.decl;
        arg.type = typedict(arg.type);
      });
    
    if (mem.argouts)
      mem.argouts.forEach((arg) => {
        arg.type = typedict(arg.type);
      });
  };
}

function translateTypes(mods) {
  var typedict = createTypeDict(mods);
  var translateMember = memberTranslate(typedict);
  mods.forEach(mod => {
    mod.qualifiedName = mod.name;
    mod.declarations.forEach(cls => {
      (cls.bases || []).forEach(base => (base.name = typedict(base.name)));
      cls.qualifiedName = mod.name + '.' + cls.name;
    }
    );


    mod.declarations.map(
        (decl) => (decl.declarations ? decl.declarations : [])
      ).concat(mod.declarations.filter(d => d.cls === 'staticfunc'))
      .reduce((a, b) => a.concat(b), [])
      .forEach(translateMember);
  });
}

function processModules(mods) {
  mods = arrify(mods);
  mods.forEach(mod => {
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
