const conf = require('./conf.js');

function registerConfigFunction(fn) {
  conf.Conf.prototype[fn.name] = fn;

  conf.MultiConf.prototype[fn.name] = function() {
    this.forEach(decl => {
      if (!decl.declarations) return true;
      return decl[fn.name].apply(decl, arguments);
    });
    return this;
  };
  return true;
}

function registerConfig() {
  return Array.from(arguments).forEach(registerConfigFunction);
}

module.exports = {
  registerConfig
};
