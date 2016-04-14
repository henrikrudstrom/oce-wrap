const arrify = require('arrify');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const settings = require('./settings.js');
const conf = require('./conf.js');

var features = settings.features || [
  'rename', 'property', 'depends', 'headers', 'class', 'typemap', 'argout', 'noHandle', 'module',  'tests'
];
var featureModules = features.map((name) => require(`./features/${name}.js`));

function Parts(name) {
  this.name = name;
  this.parts = {};
}
// data structure to store and retrieve rendered fragments
// parts are object containing a `name` and `src`, the `src`
// of parts with the same name are pushed to the same list.
// parts with an extension name are written similarly named
// file.
Parts.prototype = {
  add(parts) {
    parts = arrify(parts);
    parts.forEach((part) => {
      if (!this.parts.hasOwnProperty(part.name))
        this.parts[part.name] = [];
      this.parts[part.name].push(part.src);
    });
  },
  get(partName) {
    var parts = this.parts[partName];
    if (parts !== undefined)
      return parts.join('\n');
    return '// ' + partName + ' is not defined';
  },
  files() {
    return Object.keys(this.parts)
      .map((key) => {
        return { name: key, src: this.parts[key].join('\n') };
      })
      .filter((prt) => prt.name.endsWith('.i') || prt.name.endsWith('.js'));
  }
};

function renderFeature(method, parts, decl, feature) {
  if (decl.declarations)
    decl.declarations.forEach((d) => renderFeature(method, parts, d, feature));
  if (feature.hasOwnProperty(method))
    parts.add(feature[method](decl, parts));
}


function render(method, mod, feats) {
  if (Array.isArray(mod))
    return mod.map((m) => render(method, m, feats));
  if (typeof mod === 'string') {
    mod = JSON.parse(fs.readFileSync(mod));
    conf.mapSources(mod);
  }

  var parts = new Parts(mod.name);
  (feats || featureModules).forEach((feat) => {
    renderFeature(method, parts, mod, feat);
  });

  return parts;
}

function writeParts(dest, parts) {
  if (Array.isArray(parts)) {
    return parts.forEach((p) => writeParts(dest, p));
  }

  parts.files().forEach((part) => {
    var file = path.join(dest, parts.name, part.name);
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, part.src);
  });
  return true;
}


module.exports = render;
module.exports.feature = renderFeature;
module.exports.write = writeParts;
