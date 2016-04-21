const extend = require('extend');
const headers = require('./headers.js');
const common = require('./common.js');

function MultiConf() {}
MultiConf.prototype = [];

function createMultiConf(decls) {
  decls.__proto__ = new MultiConf();
  return decls;
}

MultiConf.prototype.include = function include(expr) {
  this.map(decl => (decl.include ? decl.include(expr) : decl));
  return this;
};
MultiConf.prototype.exclude = function exclude(expr) {
  this.map(decl => (decl.exclude ? decl.exclude(expr) : decl));
  return this;
};


function Conf(decl, parent) {
  require('./features/rename.js');
  if (decl) {
    extend(true, this, decl);
    if (parent)
      this.parent = parent;
  } else {
    this.cls = 'module';
  }
  this.declarations = [];
  // include nothing by default

  this.stacks = {
    include: [],
    transform: []
  };
}

function processInclude(decl, parent) {
  var newDecl;
  if (decl.declarations) {
    newDecl = new Conf(decl, parent.name);
    newDecl.key = decl.name;
  } else {
    newDecl = extend(true, {}, decl);
    newDecl.key = decl.name;
    if (newDecl.cls === 'memfun' || newDecl.cls === 'constructor')
      newDecl.key = `${decl.name}(${decl.arguments.map((arg) => arg.type).join(', ')})`;
  }
  return newDecl;
}

// adds .source() function to declarations, maps wrapped definition
// to the original from the headers.
function mapSources(declaration) {
  if (!declaration.declarations)
    return declaration;
  declaration.declarations.forEach((d) => {
    var decl = d;
    decl.source = function(keyProp) {
      keyProp = keyProp || 'key';
      // TODO: this is getting ugly
      if (decl.cls === 'class' || decl.cls === 'typedef' || decl.cls === 'enum')
        return headers.get(this[keyProp]);
      var parentKey = decl.parentKey || declaration.key;
      var query = parentKey + '::' + decl[keyProp];

      return headers.get(query);
    };

    if (decl.declarations)
      mapSources(decl);
  });
  return declaration;
}

Conf.prototype = {
  find(expr) {
    var res = createMultiConf(common.find(this, expr)); // TODO. search by key not name
    return res;
  },

  get(name) {
    return common.get(this, name);
  },

  include(expr) {
    if (Array.isArray(expr)) expr.map(this.include.bind(this));
    if (typeof expr !== 'function')
      if (this.cls && (this.cls === 'class' || this.cls === 'enum' || this.cls === 'typedef'))
        expr = `${this.key}::${expr}`;
      // query parsed headers for declaration
    var res = headers.find(expr)
      .map((decl) => processInclude(decl, this));
    if (res.length < 1) console.log('warning, expression ' + expr + ' returned no results.');

    this.declarations = this.declarations.concat(
      // dont add existing declarations
      res.filter((decl) => !this.declarations.some((d) => d.key === decl.key))
    );
    return this;
  },
  exclude(expr) {
    //console.log("EXPR", expr)
    var fn;
    if (typeof expr !== 'function')
      fn = common.matcher(expr, false)
    else {
      fn = decl => !expr(decl);
    }
    this.declarations = this.declarations.filter(fn);
    return this;
  },
  transform(expr, fn) {
    this.stacks.transform.push(() => {
      this.find(expr).forEach(fn);
    });
  },

  process(stackName) {
    if (stackName === undefined) {
      this.process('include');
      this.process('transform');
      this.init(); // TODO: should get a better home
      return;
    }
    if (this.declarations) {
      this.declarations
        .filter((decl) => decl.declarations)
        .forEach((decl) => decl.process(stackName));
    }
    this.stacks[stackName].forEach((fn) => fn());
    this.stacks[stackName] = [];
  },
  init() {
    mapSources(this);
  }
};

module.exports = {
  Conf,
  MultiConf,
  createMultiConf,
  mapSources
};
