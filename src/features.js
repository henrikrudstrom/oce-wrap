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

//
// typemaps
//
const convertToNative = {};
const convertToWrapped = {};
const typemaps = {}

function registerNativeConverter(fn) {
  convertToNative[fn.name] = fn;
}

function registerWrappedConverter(fn) {
  convertToWrapped[fn.name] = fn;
}
function registerTypemap(typemap){
  typemaps[typemap.native] = typemap;
}

function getTypemapConverter(native){
  var typemap = typemaps[native];
  if(!typemap) return null;
  return {
    toNative:  convertToNative[typemap.toNative](typemap),
    toWrapped:  convertToWrapped[typemap.toWrapped](typemap)
  }
  
}

function getNativeConverter(name, typemap) {
  return convertToNative[name](typemap);
}

function getWrappedConverter(name, typemap) {
  return convertToWrapped[name](typemap);
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
  registerNativeConverter,
  registerWrappedConverter,
  getNativeConverter,
  getWrappedConverter,
  getTypemapConverter,
  registerTypemap,
  load
};
