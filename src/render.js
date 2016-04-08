const arrify = require('arrify');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const settings = require('./settings.js');

var features = settings.features || ['rename', 'property', 'depends', 'class', 'module'];
var featureModules = features.map((name) => require(`./features/${name}.js`));


function Parts(name){
  this.name = name;
  this.parts = {};
}

Parts.prototype = {
  add(parts){
    parts = arrify(parts);
    parts.forEach((part) => {
      if (!this.parts.hasOwnProperty(part.name))
        this.parts[part.name] = [];
      this.parts[part.name].push(part.src);  
    });
  },
  get(partName){
    var parts = this.parts[partName];
    if(parts !== undefined)
      return parts.join('\n');
    return '// ' + partName + ' is not defined';
  },
  files(){
    return Object.keys(this.parts)
      .map((key) => {
        return { name: key, src: this.parts[key].join('\n') }
      })
      .filter((prt) => prt.name.endsWith('.i'));
      
  }
  
}


function renderFeature(parts, decl, feature){
    console.log("Render", feature.name, decl.name)
    parts.add(feature.renderSwig(decl, parts));
    if(decl.declarations)
      decl.declarations.forEach((d) => renderFeature(parts, d, feature));
}

function render(mod, features){
  if(Array.isArray(mod)) 
    return mod.map((m) => render(m, features))
  if(typeof mod === 'string')
    mod = JSON.parse(fs.readFileSync(mod));
    
  
  var parts = new Parts(mod.name);
  (features || featureModules).forEach((feat) => {
    renderFeature(parts, mod, feat);
  });
  console.log(parts.files)
  return parts;
}

function writeParts(dest, parts){
  console.log('dest', dest)
  if(Array.isArray(parts)){
    return parts.forEach((p) => writeParts(dest, p));
  }
  
  console.log("PARTS", parts)
  parts.files().forEach((part) => {
    var file = path.join(dest, parts.name, part.name)
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, part.src);
  });
}


module.exports = render;
module.exports.feature = renderFeature;
module.exports.write = writeParts;