import fs = require('fs');
import path = require('path');

export function readFile(filename: string, cb?: Function) {
  cb = cb ? cb : function() {};
  if (!filename) throw 'No file specified!';
  var pathName = path.normalize(__dirname + '/../' + filename);
  fs.readFile(pathName, {encoding: 'utf-8'}, function(err, data) {
    if (err) console.log('No log file found. Creating one...');
    cb({log: data});
  });
}

export function writeFile(filename: string, data: string, cb?: Function) {
  cb = cb ? cb : function() {}
  if (!filename) throw "No file specified!";
  var pathName = path.normalize(__dirname + '/../' + filename);
  fs.writeFile(pathName, data, {encoding: 'utf-8'}, function(err) {
    if (err) throw err;
    cb(data);
  });
}
