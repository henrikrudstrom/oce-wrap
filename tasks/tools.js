const settings = require('../src/settings.js');
settings.initialize();
var headers = require('../src/headers.js');
var yargs = require('yargs')

function cleanTypeName(ret) {
  ret = ret.replace('Handle_', '');
  ret = ret.replace(/&|\*/, '');
  ret = ret.replace('const', '');
  ret = ret.trim();
  return ret;
}
function memberDepends(mem, type, uses) {
  if(mem.type && cleanTypeName(mem.type) === type)
    uses.push(mem.parent + '::' + mem.name + ' -> type' )
  if(mem.returnType && cleanTypeName(mem.returnType) === type)
    uses.push(mem.parent + '::' + mem.name + ' -> returnType' )
  if(mem.arguments && mem.arguments.map((a) => a.type)
    .some(arg => cleanTypeName(arg) === type))
      uses.push(mem.parent + '::' + mem.name + ' -> argument' )
}

// return the type names that this class depends on
function classDepends(cls, type, uses) {

}


function findUsage(type){
  var uses = [];
  headers.listModules().forEach(modName => {

    var mod = headers.getModule(modName);
    mod.declarations
      .filter(decl => decl.declType === 'class')
      .forEach(cls => {
        //console.log(cls.name)
        cls.declarations.forEach(d => memberDepends(d, type, uses))
      })
  })
  return uses;
}
var find = yargs.argv._[0];
var res = findUsage(find);
console.log(res);
