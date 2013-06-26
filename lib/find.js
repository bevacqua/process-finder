'use strict';

var exec = require('child_process').exec;

function returnInt(item){
    return parseInt(item.trim(), 10);
}

function listeners(port, done){
    var command, rpid;

    if(process.platform === 'darwin'){ // mac os
        command = 'lsof -i tcp:' + port + ' | grep node | grep -i listen';
        rpid = / \d+ /gm;
    }else{
        command = 'netstat -n -a -o | grep -i listening | grep :' + port;
        rpid = /\d+$/gm;
    }

    exec(command, function(err, data){
        if(err){
            return done(err, []); // err usually translates to no pids
        }
        var pids = (data.match(rpid) || []).map(returnInt);
        done(null, pids);
    });
}

module.exports = {
    listeners: listeners
};