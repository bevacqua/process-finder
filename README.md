# process-finder

Find processes and watch ports for listener processes using a simple API

## Installation

Using `npm`

```bash
$ npm install process-finder --save
```

## #find(port, fn(err, pids, data, internal))

Finds processes listening on the provided `port`, invokes `fn` with an array of `pids` listening on that port.

`data` is the output of the command that checks the status of the port. `internal` will contain any internal errors that might have been suppressed.

### #find Usage

```js
var finder = require('process-finder');
var port = 3000;

finder.find(port, function(err, pids){
    // do something about the pids listening on the port, i.e:
    pids.forEach(process.kill);
});
```

Port can be an object of `options`, or just a port.

```js
{
    port: 3000, // the port we listen on
    elevate: false, // whether to use `sudo`, to get elevated priviledges
}
```

## #watch(port)

Returns an `EventEmitter` that allows us to track a port's listening processes.

Port can be an object of `options`, or just a port.

```js
{
    port: 3000, // the port we listen on
    frequency: 5000, // the frequency with which the port is scanned for changes
    elevate: false, // whether to use `sudo`, to get elevated priviledges
    log: false // if enabled, a verbose `log` event will be emitted
}
```

### #watch Usage

```js
var finder = require('process-finder');
var port = 3000; // port to watch
var watcher = finder.watch(port);

watcher.on('listen', function(pid){
    console.log(pid + ' listening on port ' + port);
});

watcher.on('unlisten', function(pid){
    console.log(pid + ' no longer listening on port ' + port);
});

watcher.on('error', console.error);
watcher.on('update', function(pids){
    console.log('updated! listeners:', pids);
});
```

### #watch API

#### #watch.stop()

Stops a `watch`. It will no longer emit events.

#### #watch.start()

Starts a watch which was previously stopped using `.stop()`

#### #watch.restart()

Force-restart the watch.

### #watch events

Watch extends the `EventEmitter` prototype, and provides a few events you can listen for.

#### #watch.on('start', fn())

Triggers when the watch is started, either when manually started, or when a new watch is created.

#### #watch.on('stop', fn())

Triggers when a watch is stopped.

#### #watch.on('listen', fn(pid))

Triggers when a `pid` is detected to be listening on the port we're watching. The `pid` is passed as an argument.

#### #watch.on('unlisten', fn(pid))

Triggers when a `pid` is detected to be no longer listening on the port we're watching. The `pid` is passed as an argument.

#### #watch.on('update', fn(pids))

Triggers every time the port is scanned for changes.

#### #watch.on('log', fn(data, internal))

`data` is the output of the command that checks the status of the port. `internal` will contain any internal errors that might have been suppressed.

#### #watch.on('error', fn(err))

Triggers whenever an error is thrown.