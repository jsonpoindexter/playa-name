
const shell = require('shelljs');

function exec(cmd, options) {
    const defaultOptions = {};
    let output = shell.exec(cmd, {...defaultOptions, ...(options || {})});
    if (options && options.toString !== false) {
        output = output.toString();
        output = options.trim ? output.trim() : output;
    }

    return output;
}

exports.exec = exec;
