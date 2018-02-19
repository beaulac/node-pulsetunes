'use strict';
const cp = require('child_process');
const util = require('util');
const execAsync = util.promisify(cp.exec);

async function _listSinkInputs() {
    return await execAsync('pactl list sink-inputs');
}

const clean = str => str.replace(/["\\]/g, '');

function _toSinkInputObj(sinkInputStr) {

    const [idStr, ...props] = sinkInputStr.split(/\n+/);

    const sinkId = idStr.replace(/[^\d]/g, '');

    const sinkInputProps = props.reduce(
        (acc, propstr) => {
            const [, key, value] = /(.+) = (.+)/.exec(propstr.trim()) || [];

            if (key && value) {
                acc[clean(key)] = clean(value);
            }

            return acc;
        },
        {}
    );

    return { sinkId, ...sinkInputProps };
}


async function findAudioProcessWithName(name) {
    const { stdout: output } = await _listSinkInputs();

    const inputs = output.split(/\n{2,}/g);

    const inputsWithName = inputs.map(_toSinkInputObj)
        .filter(sinkInput => sinkInput['application.name'] === name);

    if (inputsWithName.length === 1) {
        return inputsWithName[0];
    }
    if (inputsWithName.length === 0) {
        return Promise.reject(Error(`No inputs with name "${name}" found.`));
    }
    if (inputsWithName.length > 1) {
        return Promise.reject(Error(`More than one input with name "${name}" found, please specify.`));
    }
}

module.exports = { findAudioProcessWithName };
