require("babel-polyfill");
require('babel-core/register')({
  presets:['stage-2', 'es2015']
});

require('./app.js');