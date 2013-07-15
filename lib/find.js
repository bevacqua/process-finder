'use strict';

var exec = require('child_process').exec;

function returnInt(item){
    return parseInt(item.trim(), 10);
}

function listeners(port, done){
    var settings, command, rpid, sudo;

    if(typeof port === 'number'){
        settings = { port: port };
    }else{
        settings = port;
    }

    if(process.platform === 'win32'){
        sudo = 'runas /noprofile /user:Administrator';
        command = 'netstat -n -a -o | grep -i listening | grep :' + settings.port;
        rpid = /\d+$/gm;
    }else{
        sudo = 'sudo';
        command = 'lsof -i tcp:' + settings.port + ' | grep -i listen';
        rpid = / \d+ /gm;
    }

    if(settings.elevate){
        command = sudo + ' ' + command;
    }

    exec(command, function(err, data){
        if(err){
            return done(null, []); // err executing command translates to no pids
        }
        var pids = (data.match(rpid) || []).map(returnInt);
        done(null, pids);
    });
}

module.exports = {
    listeners: listeners
};