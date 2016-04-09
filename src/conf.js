const extend = require('extend');
const headers = require('./headers.js');
const common = require('./common.js');

function matcher(exp, matchValue) {
  if (matchValue === undefined)
    matchValue = true;
  return function(obj) {
    var key = obj.key // || obj.name;
      //console.log(exp, 'key', ""+obj.key)
    return common.match(exp, key) ? matchValue : !matchValue;
  };
}

function cleanTypeName(ret) {
  ret = ret.replace(/&|\*/, '');
  ret = ret.replace('const', '');
  ret = ret.trim();
  return ret;
}


function MultiConf() {}
MultiConf.prototype = [];

function createMultiConf(decls) {
  decls.__proto__ = new MultiConf();
  return decls;
}

MultiConf.prototype.include = function(expr) {
  this.map((decl) => decl.include(expr));
  return this;
};
MultiConf.prototype.exclude = function(expr) {
  this.map((decl) => decl.exclude(expr));
  return this;
};


function Conf(decl, parent) {
  require('./features/rename.js');
  if (decl) {
    extend(true, this, decl)
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
  }
}

function processInclude(decl, parent) {
  var newDecl;
  if (decl.declarations) {
    newDecl = new Conf(decl, parent.name);
    newDecl.key = decl.name;
  } else {
    newDecl = extend(true, {}, decl);
    newDecl.key = decl.name;
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
      console.log('Query', query)
      return headers.get(query);
    };

    if (decl.declarations)
      mapSources(decl);
  });
  return declaration;
}

Conf.prototype = {
  find(expr) {
    var res = createMultiConf(common.find(this, expr, matcher)); // TODO. search by key not name
    return res;
  },

  get(name) {
    return common.get(this, name, matcher);
  },

  include(expr) {
    if (Array.isArray(expr)) expr.map(this.include.bind(this));
    if (this.cls && (this.cls === 'class' || this.cls === 'enum'))
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
    this.declarations = this.declarations.filter(matcher(expr, false));
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
      this.init(); //TODO: should get a better home
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
