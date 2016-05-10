var common = require('./common.js');
var settings = require('./settings.js');
var modules; // intialized on demand;

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const camelCase = require('camel-case');

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
  if (suite in overridenTests) {
    return overridenTests[suite].indexOf(spec) !== -1;
  }
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



var next = 0;

function int() {
  next += 1;
  return Math.round(next); // nextInt.toString();
}

function double() {
  next += 0.5;
  return next;
}

function bool() {
  next += 1;
  return Boolean(!Math.round(next) % 2);
}

function resetNumbers() {
  next = 0;
}

function createValue(typeName, index) {
  if (typeName === 'Integer') return int();
  if (typeName === 'Double') return double();
  if (typeName === 'Boolean') return bool();
  if (typeName === 'String') return '';
  var mod = typeName.split('.')[0];
  var type = typeName.split('.')[1] || typeName;
  // if (!mod || !type) throw new Error(typeName)
  type = type.slice(0, 1).toLowerCase() + type.slice(1);
  return `create.${mod}.${type}()`;
}
module.exports.createValue = createValue;


// check if all arguments / return types are wrapped, otherwise dont test it.
function requiredTypesWrapped(member) {
  modules = modules || require('./modules.js')();

  var unwrapped = member.arguments ? member.arguments.map(arg => arg.type) : [];
  if (member.declType !== 'constructor')
    unwrapped.push(member.returnType || member.type);

  var res = unwrapped.every(
    type => type === 'void' || type === 'Array' || type === 'Object' || modules.get(type)
  );

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
    return ['expect(typeof res).to.equal(\'number\');'];
  else if (returnType === 'Boolean')
    return ['expect(typeof res).to.equal(\'boolean\');'];
  else if (returnType !== 'void')
    return [
      `helpers.expectType(res, '${returnType}');`
    ];
  return [];
}


function memberReturnType(cls, member, suiteKey) {
  if (member.declType === 'constructor') return cls.name;
  modules = modules || require('./modules.js')();
  var rtype = (member.returnType || member.type);
  var type = modules.get(rtype);
  if (type && type.declType === 'enum') return 'Integer';
  var returnType = rtype.indexOf('.') !== -1 ?
    rtype.split('.')[1] : rtype;
  if (member.downCastToThis)
    returnType = cls.name;


  var override = specOverride.returnType(suiteKey, common.signature(member));
  if (override)
    returnType = override;
  return returnType;
}

function renderPendingTest(signature, comment) {
  return `
  // ${comment}
  xit('${signature}', function() { });`;
}

function renderTest(member, testSrc, parts) {
  var cls = member.getParent();
  var signature = common.signature(member);

  var excludedReason = excluded(cls.qualifiedName, member);
  if (excludedReason)
    return '// ${excludedReason}';

  var pendingReason = pending(cls.qualifiedName, member);
  if (pendingReason)
    return renderPendingTest(signature, pendingReason);


  if (member.declType !== 'constructor' || member.declType !== 'property') {
    var returnType = memberReturnType(cls, member, cls.qualifiedName);
    testSrc += expectType(returnType).map(l => '\n    ' + l).join('');
  }
  testSrc += parts.get(cls.name + '.' + signature + 'Expectations');
  var consolelog = yargs.argv.logspec ? `    console.log('${signature}')\n` : '';
  var src = `
  it('${signature}', function() {
${consolelog}${testSrc}
  });`;

  resetNumbers();

  return src;
}

module.exports = {
  pending,
  excluded,
  memberReturnType,
  expectType,
  createValue,
  renderTest,
  resetNumbers
};
