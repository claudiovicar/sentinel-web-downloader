const fs = require('fs');
const url = require('url');
const path = require('path');
const xml2js = require('xml2js');

const fileUtils = require('./fileUtils');
const sentinelUtils = require('./sentinelUtils');

const MANIFEST_SAFE = 'manifest.safe';
const MANIFEST_JSON = 'manifest.json';
const GOOGLE_STORAGE_URL = 'https://storage.googleapis.com/';

const xmlParser = new xml2js.Parser();

function getRemoteManifestURL(scene) {
  return scene.base_url.replace('gs://', GOOGLE_STORAGE_URL) + '/' + MANIFEST_SAFE;
}

function getManifestPath(scene) {
  return path.join(sentinelUtils.getDestinationFolder(scene), MANIFEST_JSON);
}

function getManifestContent(scene) {
  const data = fs.readFileSync(getManifestPath(scene)).toString();

  return JSON.parse(data);
}

function downloadManifest(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), MANIFEST_SAFE);

  const manifestURL = getRemoteManifestURL(scene);

  return fileUtils.download(manifestURL, destinationFile, {skip: true})
  .then(filePath => {
    return manifestXML2JSON(destinationFile, scene);
  })
  .catch(e => {});

}

function manifestXML2JSON(manifestXMLPath, scene) {

  console.log('Convertendo manifest XML para JSON...');

  const destinationFile = path.join(sentinelUtils.getDestinationFolder(scene), MANIFEST_JSON);

  return new Promise((resolve, reject) => {

    if (fs.existsSync(destinationFile)) {
      return resolve(destinationFile);
    }

    const data = fs.readFileSync(manifestXMLPath).toString();

    xmlParser.parseString(data, function (err, result) {
      if (err)
        reject(err);

      fs.writeFileSync(destinationFile, JSON.stringify(result));

      resolve(destinationFile);
    });

  });

}

function getResourceURL(scene, pattern, resourcePattern) {

  const manifest = getManifestContent(scene);

  const objects = manifest['xfdu:XFDU']['dataObjectSection'][0].dataObject;

  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    if (object['$'].ID.match(pattern)) {
      // const baseURL = scene.base_url.replace('gs://', GOOGLE_STORAGE_URL);
      const resourceURL = object['byteStream'][0].fileLocation[0]['$'].href;
      if (!resourcePattern || resourceURL.match(resourcePattern)) {
        return url.resolve(GOOGLE_STORAGE_URL, path.join(scene.base_url.replace('gs://', ''), resourceURL));
      }
    }
  }

}

// TODO: Replicado de sentinelTileDownloader.js
function createDestinationFolder(scene) {

  const destFolder = sentinelUtils.getDestinationFolder(scene);

  fileUtils.createFolder(destFolder);

  return destFolder;

}

module.exports = {downloadManifest, getResourceURL}