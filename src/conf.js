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
  this.map((decl) => decl.include(expr));
  return this;
};
MultiConf.prototype.exclude = function exclude(expr) {
  this.map((decl) => decl.exclude(expr));
  return this;
};
MultiConf.prototype.rename = function rename(expr, newName) {
  this.map((decl) => decl.rename(expr, newName));
  return this;
};
MultiConf.prototype.camelCase = function camelCase(expr) {
  this.map((decl) => decl.camelCase(expr));
  return this;
};
MultiConf.prototype.property = function property(getter, setter) {
  this.map((decl) => decl.property(getter, setter));
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

function mapSources(declaration) {
  declaration.declarations.forEach((d) => {
    var decl = d;
    decl.source = function(keyProp) {
      keyProp = keyProp || 'key';
      if (declaration.cls === 'module')
        return headers.get(this[keyProp]);
      var query = declaration.key + '::' + decl[keyProp];

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
    if (this.cls && (this.cls === 'class' || this.cls === 'enum' || this.cls === 'typedef'))
      expr = `${this.key}::${expr}`;

    // query parsed headers for declaration
    var res = headers.find(expr)
      .map((decl) => processInclude(decl, this));

    this.declarations = this.declarations.concat(
      // dont add existing declarations
      res.filter((decl) => !this.declarations.some((d) => d.key === decl.key))
    );
    return this;
  },
  exclude(expr) {
    this.declarations = this.declarations.filter(common.matcher(expr, false));
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
  createMultiConf,
  mapSources
};
