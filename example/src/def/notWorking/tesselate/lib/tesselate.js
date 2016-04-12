const tesselate = require('./_tesselate.node');
module.exports = function (shape, dev) {
  var t = new tesselate.Tesselator(shape, dev || 0.01);
  var res = t.exportJSON();
  return JSON.parse(res);
};
