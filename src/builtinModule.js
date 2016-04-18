const conf = require('./conf.js');

// mock model to handle renaming of standard types
module.exports = function() {
  var mod = new conf.Conf();
  mod.name = 'builtins';
  mod.include('Standard_Real');
  mod.include('Standard_Integer');
  mod.include('Standard_Boolean');
  mod.include('Standard_CString');
  mod.rename('Standard_Real', 'Double');
  mod.rename('Standard_Integer', 'Integer');
  mod.rename('Standard_Boolean', 'Boolean');
  mod.rename('Standard_CString', 'String');
  mod.process();
  return mod;
};
