'use strict';

var find = require('./find.js');
var Watch = require('./watch.js');

module.exports = {
  find: find.listeners,
  watch: function(port) {
    return new Watch(port);
  }
};
