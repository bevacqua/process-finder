# process-finder

Find processes and watch ports for listener processes using a simple API

## Installation

Using `npm`

```bash
$ npm install process-finder --save
```

## #watch(port)

Returns an `EventEmitter` that allows us to track a port's listening processes.

Port can be an object of `options`, or just a port.

```js
{
    port: 3000, // the port we listen on
    frequency: 5000 // the frequency with which the port is scanned for changes
}
```

Example:

```js
var watcher = watch(3000);

watcher.on('listen', function(pid){
    // do something about it
});
```

#### #watch.stop()

Stops a `watch`. It will no longer emit events.

#### #watch.start()

Starts a watch which was previously stopped using `.stop()`

## #watch events

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

#### #watch.on('error', fn(err))

Triggers whenever an error is thrown.