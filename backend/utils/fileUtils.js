const {promisify} = require('util');
const tmp = require('tmp');
var https = require('https');
var fs = require('fs');
var mkdirp = require('mkdirp');

const download = function(url, dest, options, callback) {

  if(options && options.skip && fs.existsSync(dest)) {
    if (callback) {
      callback(null, dest);
    }
    return;
  }

  var file = fs.createWriteStream(dest);

  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(function() {
        if (callback) callback(null, dest);
      });
    });
  }).on('error', function(err) {
    fs.unlinkSync(dest);
    console.error(err);
    if (callback) callback(err.message);
  });

};

const downloadToTemp = function(url, callback) {
  let tempTile = this.createTempFile();

  this.download(url, tempTile.name, {}, callback);

  return tempTile;
};

exports.createTempFile = function() {
  return tmp.fileSync();
};

exports.createFolder = function(path) {
  return mkdirp.sync(path);
};

exports.downloadToTemp = promisify(downloadToTemp);

exports.download = promisify(download);
