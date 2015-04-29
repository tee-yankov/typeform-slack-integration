var fs = require('fs');
var path = require('path');
function readFile(filename, cb) {
    cb = cb ? cb : function () { };
    if (!filename)
        throw 'No file specified!';
    var pathName = path.normalize(__dirname + '/../' + filename);
    fs.readFile(pathName, { encoding: 'utf-8' }, function (err, data) {
        if (err)
            console.log('No log file found. Creating one...');
        cb({ log: data });
    });
}
exports.readFile = readFile;
function writeFile(filename, data, cb) {
    cb = cb ? cb : function () { };
    if (!filename)
        throw "No file specified!";
    var pathName = path.normalize(__dirname + '/../' + filename);
    fs.writeFile(pathName, data, { encoding: 'utf-8' }, function (err) {
        if (err)
            throw err;
        cb(data);
    });
}
exports.writeFile = writeFile;
