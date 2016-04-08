require('./features/rename.js');

const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const path = require('path');
const settings = require('./settings.js');
var conf = require('./conf.js');
var createTypeDict = require('./typedict.js')


function configureModule(file){
  //var file = file.replace("src/configure/", "./");
  file = path.relative(__dirname, file);
  var configure = require(file);
  
  var mod = new conf.Conf();
  configure(mod);
  mod.process();
  if(!mod.name) 
    throw new Error('Configuration Error: module name must be specified.');
  return mod;
}

function translateTypes(mods){
  var typedict = createTypeDict(mods);
  mods.forEach((mod) => {
    mod.declarations.map(
      (decl) => decl.bases ? decl.bases : []
    ).forEach((base) => base.name = typedict(base.name))
    
    mod.declarations.map(
      (decl) => decl.declarations ? decl.declarations : []
    )
    .reduce((a,b) => a.concat(b))
    .forEach(
      (mem) => {
        mem.returnType = typedict(mem.returnType);
        mem.arguments.forEach((arg) => {
          delete arg.decl;
          arg.type = typedict(arg.type);
        });
      }
    );
  });
}

function configure(configurationFiles, outputPath){
  console.log(configurationFiles)
  var mods = configurationFiles.map(configureModule)
  
  translateTypes(mods);
  
  mods.forEach((mod) => {
    delete mod.stacks
    mod.declarations.forEach((decl) => delete decl.stacks)
    var destFile = `${outputPath}/${mod.name}.json`;
    mkdirp.sync(path.dirname(destFile));
    fs.writeFileSync(destFile, JSON.stringify(mod, null, 2));  
  });
}

module.exports = configure;
module.exports.translateTypes = translateTypes;