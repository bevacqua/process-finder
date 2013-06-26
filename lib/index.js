'use strict';

var find = require('./find.js');

function watch(port, done){
    var settings;

    if(typeof port === 'object'){
        settings = port;
    }else{
        settings = { port: port, interval: interval };
    }
}

module.exports = {
    find: find.listeners,
    watch: watch
};
