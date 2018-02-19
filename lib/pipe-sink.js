'use strict';
const cp = require('child_process');

function killCpOnExit(spawnedProcess) {
    process.on('exit', () => spawnedProcess.kill());
}

function notifyOnExit(spawnedProcess) {
    spawnedProcess.on('exit', code => console.log(`Child process exited with exit code ${code}`));
}

function getSinkInputPipe(sinkInputId) {
    const spawnedProcess = cp.spawn('pacat', ['-r', `--monitor-stream=${sinkInputId}`, '--channels=2', '--format=s16le']);

    killCpOnExit(spawnedProcess);
    notifyOnExit(spawnedProcess);


    process.stdin.on('data', function (d) {
    });

    process.stdin.on('error', function (err) {
        console.error(err);
    });


    return spawnedProcess.stdout;
}

module.exports = { getSinkInputPipe };
