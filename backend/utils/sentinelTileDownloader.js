const fileUtils = require('./fileUtils');
const sentinelUtils = require('./sentinelUtils');

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const exec = require('child_process').exec;

const PREVIEW_IMG_NAME = 'preview.jpg';
const PREVIEW_TMP_IMG_NAME = 'preview.jp2';
const MANIFEST_SAFE = 'manifest.safe';
const MANIFEST_JSON = 'manifest.json';
const GOOGLE_STORAGE_URL = 'https://storage.googleapis.com/';

const xmlParser = new xml2js.Parser();

// SENTINEL2_PREVIEW_IMAGE=https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/{utm}/{latitude}/{square}/{year}/{month}/{day}/0/preview.jpg

/**
 * Downloads the tile manifest.safe and converts it to JSON
 * Parses the JSON file, downloads the preview image and converts it to JPG.
 */
function initTile() {

  downloadManifest();

}

function downloadPreview(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), PREVIEW_IMG_NAME);

  if (fs.existsSync(destinationFile)) {
    return new Promise((resolve, reject) => {
      resolve(destinationFile);
    });
  }

  // const {utm, latitude, square, year, month, day} = scene.getSceneInfo();

  // const previewURL = `https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/${utm}/${latitude}/${square}/${year}/${month}/${day}/0/preview.jpg`;

  // console.log(previewURL);

  return downloadManifest(scene)
    .then(() => {
      return downloadPreviewTCI(scene);
    });

}

function downloadManifest(scene) {

  const destinationFile = path.join(createDestinationFolder(scene), MANIFEST_SAFE);

  // if (fs.existsSync(destinationFile)) {
  //   return new Promise((resolve, reject) => {
  //     resolve(destinationFile);
  //   });
  // }

  // TODO: Criar função para isso
  const manifestURL = scene.base_url.replace('gs://', GOOGLE_STORAGE_URL) + '/' + MANIFEST_SAFE;

  return fileUtils.download(manifestURL, destinationFile, {skip: true})
  .then(filePath => {
    return manifestXML2JSON(destinationFile, scene);
  })
  .catch(e => {});

}

function manifestXML2JSON(manifestXMLPath, scene) {

  console.log('Convertendo manifest XML para JSON...');

  const destinationFile = path.join(sentinelUtils.getDestinationFolder(scene), MANIFEST_JSON);

  // if (fs.existsSync(destinationFile)) {
  //   return new Promise((resolve, reject) => {
  //     resolve(destinationFile);
  //   });
  // }

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

  // let result = '';
  // result['xfdu:XFDU']['dataObjectSection']
  // result['xfdu:XFDU']['dataObjectSection'][0].dataObject

}

function getPreviewURL(scene) {

  const pathJSONManifest = path.join(sentinelUtils.getDestinationFolder(scene), MANIFEST_JSON);

  const data = fs.readFileSync(pathJSONManifest).toString();

  const manifest = JSON.parse(data);

  const url = getResourceURLFromManifest(scene, manifest, 'Preview');

  console.log('URL do preview: ' + url);

  return url;

}

function getResourceURLFromManifest(scene, manifest, pattern) {

  const objects = manifest['xfdu:XFDU']['dataObjectSection'][0].dataObject;

  for (let index = 0; index < objects.length; index++) {
    const object = objects[index];
    if (object['$'].ID.match(pattern)) {
      const baseURL = scene.base_url.replace('gs://', GOOGLE_STORAGE_URL);
      const resourceURL = object['byteStream'][0].fileLocation[0]['$'].href;
      return path.join(baseURL, resourceURL);
    }
  }

}

function downloadPreviewTCI(scene) {

  const tempPreviewFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_TMP_IMG_NAME);
  const destinationFile = path.join(sentinelUtils.getDestinationFolder(scene), PREVIEW_IMG_NAME);

  const previewURL = getPreviewURL(scene);

  return fileUtils.download(previewURL, tempPreviewFile, {})
    .then(() => {

      return new Promise((resolve, reject) => {

        exec(`gdal_translate -of JPEG -a_nodata 0 ${tempPreviewFile} ${destinationFile}`, function(err, stdout, stderr) {

          if(err || stderr) {
            console.log('Erro ao converter JP2 para JPEG ' + (err || stderr));
            reject();
          }

          resolve(destinationFile);

        });

      });

    })
    .catch(e => {
      console.log(e);
    });

}

function createDestinationFolder(scene) {

  const destFolder = sentinelUtils.getDestinationFolder(scene);

  fileUtils.createFolder(destFolder);

  return destFolder;

}

module.exports = {downloadPreview};