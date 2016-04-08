const arrify = require('arrify');
const fs = require('fs');
const path = require('path');

// defines which features to render and in what order.
var features = ['rename', 'property', 'class', 'module']
var featureModules = features.map((name) => require(`./features/${name}.js`));


function Parts(){
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
    return this.parts
      .filter((prt) => prt.name.endsWith('.i'))
  }
  
}


function renderFeature(parts, decl, feature){
    console.log("Render", feature.name, decl.name)
    parts.add(feature.renderSwig(decl, parts));
    if(decl.declarations)
      decl.declarations.forEach((d) => renderFeature(parts, d, feature));
}

function render(mod, features){
  var parts = new Parts();
  (features || featureModules).forEach((feat) => {
    renderFeature(parts, mod, feat);
  });
  return parts;
}

function writeParts(dest, parts){
  parts.files().forEach((part) => 
    fs.writeFileSync(path.join(dest, part.name), part.src)
  );
}


module.exports = render;
module.exports.feature = renderFeature;
module.exports.write = writeParts;