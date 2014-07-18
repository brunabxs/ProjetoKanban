var Properties = require('./node-server-properties');
var Server = require('./classes/class-server');

new Server().start(Properties.PORT);

