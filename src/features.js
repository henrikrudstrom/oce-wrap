const path = require('path');
const glob = require('glob');

const conf = require('./conf.js');
const settings = require('./settings.js');


var renderers = {};

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


function registerRenderer(type, order, fn) {
  if (!renderers[type])
    renderers[type] = [];
  renderers[type].push({ order, fn });
}

function getRenderers(type) {
  var res = (renderers[type] || []);
  res = res.sort((a, b) => a.order - b.order);
  var result = res.map(obj => obj.fn);
  return result;
}


// ----------------------------------------------------------------------------
// Typemaps
// ----------------------------------------------------------------------------

const typemaps = {};
const typemapRenderers = {};

function registerTypemapRenderer(name, renderer) {
  typemapRenderers[name] = renderer;
}

function getTypemapRenderer(tm) {
  if (!tm || !tm.renderer) return null;
  var res = typemapRenderers[tm.renderer];
  if (!res) return null;
  return res(tm);
}

function registerTypemap(typemap) {
  typemaps[typemap.native] = typemap;
}

function getTypemap(nativeType) {
  return typemaps[nativeType] || null;
}

function getTypemaps() {
  return Object.keys(typemaps).map(key => typemaps[key]);
}

function load() {
  var files = [
    glob.sync(path.join(__dirname, 'features', '*.js')),
    glob.sync(path.join(settings.paths.definition, 'features', '*.js'))
  ].reduce((a, b) => a.concat(b));

  return files.map(file => {
    var relativePath = path.relative(__dirname, file);
    if (!relativePath.startsWith('.'))
      relativePath = './' + relativePath;
    return require(relativePath);
  });
}


module.exports = {
  registerConfig,
  registerRenderer,
  getRenderers,
  registerTypemap,
  getTypemap,
  getTypemaps,
  registerTypemapRenderer,
  getTypemapRenderer,
  load
};
