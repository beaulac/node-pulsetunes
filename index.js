const airtunes = require('airtunes');
const inputLookup = require('./lib/sink-input-lookup');
const pipeSink = require('./lib/pipe-sink');

const argv = require('optimist')
    .usage('Usage: $0 --host [host] --port [num] --volume [num] --process [processName]')
    .default('host', 'localhost')
    .default('port', 5000)
    .default('volume', 50)
    .demand(['process'])
    .argv;

async function start() {
    const { sinkId } = await inputLookup.findAudioProcessWithName(argv.process);

    const sinkInputPipe = pipeSink.getSinkInputPipe(sinkId);
    
    sinkInputPipe.pipe(airtunes);
    sinkInputPipe.resume();
}

function setupHosts() {
    const hosts = argv.host.split(' ');
    const devices = {};
    hosts.forEach(function (host) {
        devices[host] = airtunes.add(host, argv);
        console.log('adding device: ' + host + ':' + argv.port);
    });

    // process event handlers
    process.stdin.on('data', function () {
    });

    process.stdin.on('error', function () {
    });

    airtunes.on('drain', function (e) {
    });

// monitor buffer events
    airtunes.on('buffer', function (status) {
        console.log('buffer ' + status);
        if (status === 'end') {
        }
    });
}

start().then(setupHosts).catch(console.error);
