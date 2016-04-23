var common = require('./common.js');
var settings = require('./settings.js');
const features = require('./features');
var modules; // intialized on demand;

const glob = require('glob');
const fs = require('fs');
const path = require('path');


// Parse specs in module folder to remove tests that are manually defined
// TODO: find a package for this or make it explicit
function parseTests() {
  var specs = {};
  glob.sync(`${settings.paths.definition}/spec/**/*Spec.js`)
    .concat(glob.sync(`${settings.paths.definition}/spec/*Spec.js`))
    .forEach(file => {
      var itexp = / *x?it\('(\w+\(.*\))',((?:.|\n)*?\}\));/g;
      var descExp = /describe\('((?:\w|\.|_| )*)',((?:.|\n)*?}\)(\n| |;)*}\)?)/g;
      var src = fs.readFileSync(file).toString();
      var matches = src.match(descExp);
      if (matches)
        matches.forEach(desc => {
          var suite = desc.match(/describe\('(.+)'/)[1];
          var smatches = desc.match(itexp);
          if (smatches)
            smatches.forEach(it => {
              var name = it.match(/it\('(\w+\(.*\))'/)[1];
              if (!Array.isArray(specs[suite]))
                specs[suite] = [];
              specs[suite].push(name);
            });
        });
    });
  return specs;
}


var overridenTests = parseTests();

function isOverriden(suite, spec) {
  if (suite in overridenTests)
    return overridenTests[suite].indexOf(spec) !== -1;
  return false;
}

var specOverridePath = path.join(settings.paths.definition, 'spec', 'notWorking.js');
var specOverride = fs.existsSync(specOverridePath) ?
  require(path.relative(__dirname, specOverridePath)) : {
    notWorking() {
      return false;
    },
    returnType() {
      return false;
    }
  };

var nextInt = 0;
var nextDouble = 0.0;
var nextBool = false;

function int() {
  nextInt += 1;
  return 1; // nextInt.toString();
}

function double() {
  nextDouble += 0.5;
  return nextDouble.toString();
}

function bool() {
  nextBool = !nextBool;
  return nextBool.toString();
}

function createValue(typeName) {
  if (typeName === 'Integer') return int();
  if (typeName === 'Double') return double();
  if (typeName === 'Boolean') return bool();
  if (typeName === 'String') return '';
  return `create.${typeName}()`;
}
module.exports.createValue = createValue;

function requiredTypesWrapped(member) {
  modules = modules || require('./modules.js')();
  var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  if (member.cls !== 'constructor')
    unwrapped.push(member.returnType || member.type);
  var res = unwrapped.every(type => {
    return type === 'void' || modules.get(type)
  });
  // if(!res){
  //   console.log("unwrapped not", unwrapped, member.name)
  // }
  return res;
}


function excluded(qualifiedClsName, member) {
  var signature = common.signature(member);
  if (isOverriden(qualifiedClsName, signature)) {
    return signature + ' Redefined.';
  }
  return false;
}

function pending(qualifiedClsName, member) {
  var signature = common.signature(member);

  if (!requiredTypesWrapped(member))
    return 'Arguments or return type not wrapped.';

  if (specOverride.notWorking(qualifiedClsName, signature)) {
    return 'TODO: ' + signature + 'not working.';
  }
  return false;
}

function expectType(returnType) {
  if (returnType === 'Integer' || returnType === 'Double')
    return ['expect(typeof res).toBe(\'number\');'];
  else if (returnType === 'Boolean')
    return ['expect(typeof res).toBe(\'boolean\');'];
  else if (returnType !== 'void')
    return [
      'expect(typeof res).toBe(\'object\');',
      `expect(res.constructor.name.replace('_exports_', '')).toBe('${returnType}');`
    ];
  return [];
}

function memberReturnType(cls, member, suiteKey) {
  modules = modules || require('./modules.js')();
  var type = modules.get(member.returnType);
  if (type && type.cls === 'enum') return 'Integer';
  var returnType = member.returnType.indexOf('.') !== -1 ?
    member.returnType.split('.')[1] : member.returnType;
  if (member.downCastToThis)
    returnType = cls.name;


  var override = specOverride.returnType(suiteKey, common.signature(member));
  if (override)
    returnType = override;
  return returnType;
}


module.exports = {
  pending,
  excluded,
  memberReturnType,
  expectType,
  createValue
};