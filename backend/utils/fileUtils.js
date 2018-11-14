const {promisify} = require('util');
const tmp = require('tmp');
var http = require('http');
var fs = require('fs');


const download = function(url, dest, callback) {
  var file = fs.createWriteStream(dest);

  http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(callback);
    });
  }).on('error', function(err) {
    fs.unlink(dest);
    if (callback) callback(err.message);
  });
};

const downloadToTemp = function(url, callback) {
  let tempTile = this.createTempFile();

  this.download(url, tempTile.name, callback);

  return tempTile;
};

exports.createTempFile = function() {
  return tmp.fileSync();
};

exports.downloadToTemp = promisify(downloadToTemp);

exports.download = promisify(download);