require("babel-polyfill");

var register = require('babel-core/register');

register({
	presets:['stage-3','es2015']
});

require('./app.js');