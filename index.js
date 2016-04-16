module.exports.settings = require('./src/settings.js');
module.exports.init = function(gulp, options) {
  module.exports.settings.initialize(options);
  require('./src/tasks/main.js')(gulp);
};
