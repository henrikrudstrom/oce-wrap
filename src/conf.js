const extend = require('extend');
const arrify = require('arrify');
const headers = require('./headers.js');
const common = require('./common.js');
const logger = require('winston');


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
    this.declType = 'module';
  }

  this.declarations = [];
  this.typemaps = [];
  this.stacks = [];
}


function processInclude(decl, parent) {
  var newDecl;
  if (decl.declarations) {
    newDecl = new Conf(decl, parent.name);
    newDecl.key = decl.name; //TODO: get rid of .key

  } else {
    newDecl = extend(true, {}, decl);

    if (!decl.key) {
      newDecl.key = decl.name;
      if (newDecl.declType === 'memfun' || newDecl.declType === 'constructor')
        newDecl.key = `${decl.name}(${decl.arguments.map((arg) => arg.type).join(', ')})`;
    }
  }

  if(newDecl.origName === undefined)
    newDecl.origName = decl.name;

  if(newDecl.returnType !== undefined && newDecl.origReturnType === undefined)
    newDecl.origReturnType = decl.returnType;

  if(newDecl.type !== undefined && newDecl.origType === undefined)
    newDecl.origType = decl.type;

  if(newDecl.arguments !== undefined && newDecl.origArguments === undefined){
    newDecl.origArguments = extend(true, [], newDecl.arguments);
  }

  if(newDecl.bases !== undefined)
    newDecl.bases.forEach(base => base.origName = base.name);


  newDecl.getParent = () => parent;

  newDecl.extend = function(props) {
    return extend(true, this, props);
  };
  return newDecl;
}


// adds .getParent() function to declarations
function mapSources(declaration) {
  if (!declaration.declarations)
    return declaration;
  declaration.declarations.forEach(decl => {
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
      if (this.declType && (this.declType === 'class' || this.declType === 'enum' || this.declType === 'typedef'))
        expr = `${this.key}::${expr}`;

    // query parsed headers for declaration
    var res = headers.find(expr);

    if (res.length < 1)
      logger.warn('Expression ' + expr + ' returned no results.');

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
