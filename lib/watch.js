'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var find = require('./find.js');
var defaultFrequency = 5000;

function PortWatch(port){
    var settings;

    if(typeof port === 'number'){
        settings = { port: port, frequency: defaultFrequency };
    }else{
        settings = port;
    }

    initWatch(this, settings);
}

function initWatch(watcher, settings){
    EventEmitter.call(watcher);

    watcher.__port = settings.port;
    watcher.__pids = [];
    watcher.__frequency = settings.frequency;
    watcher.start();
}

util.inherits(PortWatch, EventEmitter);

PortWatch.prototype.start = function(){
    if(!this.__timeout){
        this.restart();
        this.emit('start');   
    }
}

PortWatch.prototype.restart = function(){
    clearTimeout(this.__timeout);
    this.__timeout = setTimeout(watch, this.__frequency, this);
}

PortWatch.prototype.stop = function(){
    if(this.__timeout){
        clearTimeout(this.__timeout);
        this.__timeout = null;
        this.emit('stop');
    }
};

function watch(watcher){
    find.listeners(watcher.__port, function(err, pids){
        if(err){
            return watcher.emit('error', err);
        }

        var old = watcher.__pids; // previous listeners
        var cur = pids; // current listeners

        emitChange(watcher, 'unlisten', old, cur);
        emitChange(watcher, 'listen', cur, old);

        watcher.__pids = pids;
        watcher.emit('update', pids);
        watcher.restart(); // loop
    });
}

function emitChange(emitter, type, source, target){
    source.forEach(function(pid){
        if(target.indexOf(pid) === -1){
            emitter.emit(type, pid);
        }
    });
}

module.exports = PortWatch;