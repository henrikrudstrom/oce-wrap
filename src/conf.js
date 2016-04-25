const extend = require('extend');
const arrify = require('arrify');
const headers = require('./headers.js');
const common = require('./common.js');
const debug = require('debug')('oce-wrap:conf');

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
MultiConf.prototype.extend = function exclude(props) {
  this.map(decl => (decl.extend ? decl.extend(props) : decl));
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
  this.typemaps = [];
  // include nothing by default

  this.stacks = [];
}


function getSource(decl, declaration) {
  return function(keyProp) {
    keyProp = keyProp || 'key';
    // TODO: this is getting ugly
    if (decl.cls === 'class' || decl.cls === 'typedef' || decl.cls === 'enum')
      return headers.get(this[keyProp]);
    var parentKey = decl.parentKey || declaration.key;
    var query = parentKey + '::' + decl[keyProp];

    return headers.get(query);
  };
}

function processInclude(decl, parent) {
  var newDecl;
  if (decl.declarations) {
    newDecl = new Conf(decl, parent.name);
    newDecl.key = decl.name;
  } else {
    newDecl = extend(true, {}, decl);

    if (!decl.key) {
      newDecl.key = decl.name;
      if (newDecl.cls === 'memfun' || newDecl.cls === 'constructor')
        newDecl.key = `${decl.name}(${decl.arguments.map((arg) => arg.type).join(', ')})`;
    }
  }
  newDecl.getParent = () => parent;
  newDecl.source = getSource(decl, parent);

  return newDecl;
}


// adds .source() function to declarations, maps wrapped definition
// to the original from the headers.
function mapSources(declaration, parent) {
  if (!declaration.declarations)
    return declaration;
  declaration.declarations.forEach((d) => {
    var decl = d;
    decl.source = getSource(decl, declaration);
    decl.getParent = function() {
      return declaration;
    };

    if (decl.declarations)
      mapSources(decl);
  });
  return declaration;
}

Conf.prototype = {
  find(expr) {
    var res = createMultiConf(common.find(this, expr));

    return res;
  },

  get(name) {
    return common.get(this, name);
  },
  add(decls) {
    decls = arrify(decls);
    this.declarations = this.declarations.concat(decls
      .map(decl => processInclude(decl, this))
      // .filter((decl) => !this.declarations.some((d) => d.key === decl.key))
    );
  },
  include(expr) {
    if (Array.isArray(expr)) expr.map(this.include.bind(this));
    if (typeof expr !== 'function')
      if (this.cls && (this.cls === 'class' || this.cls === 'enum' || this.cls === 'typedef'))
        expr = `${this.key}::${expr}`;
      // query parsed headers for declaration
    var res = headers.find(expr);
    if (res.length < 1) console.log('warning, expression ' + expr + ' returned no results.');

    this.add(res);
    return this;
  },
  exclude(expr) {
    var fn;
    if (typeof expr !== 'function')
      fn = common.matcher(expr, false);
    else {
      fn = decl => !expr(decl);
    }
    this.declarations = this.declarations.filter(fn);
    return this;
  },
  extend(props) {
    return extend(true, this, props);
  },

  pushQuery(i, expr, fn) {
    this.pushMethod(i, () => this.find(expr).forEach(fn));
  },

  pushMethod(i, fn) {
    if (!this.stacks[i])
      this.stacks[i] = [];
    this.stacks[i].push(fn);
  },

  processStack(index) {
    var stack = this.stacks[index];
    if (stack !== undefined)
      stack.forEach((fn) => fn());
    if (this.declarations) {
      this.declarations
        .filter(decl => decl.processStack)
        .forEach(decl => decl.processStack(index));
    }
  },
  process() {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      .forEach(index => this.processStack(index));
  }
};

module.exports = {
  Conf,
  MultiConf,
  createMultiConf,
  mapSources
};
