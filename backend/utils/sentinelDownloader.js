const {promisify} = require('util');
const fileUtils = require('./fileUtils');
const asyncGunzip = promisify(require('gunzip-file'));
const fastCSV = require('fast-csv');
const fs = require('fs');

const SentinelTile = require('../models/SentinelTile')

const SENTINEL2_METADATA_URL = 'http://storage.googleapis.com/gcp-public-data-sentinel-2/index.csv.gz';
// const SENTINEL2_METADATA_URL = 'http://ufpr.dl.sourceforge.net/project/od1n/samples.tar.gz';

const csvHeaders = ['granule_id', 'product_id', 'datatake_identifier', 'tile_id', 'sensing_time', 'total_size', 'cloud_cover',
'geometric_quality_flag', 'generation_time', 'north_lat', 'south_lat', 'west_lon', 'east_lon', 'base_url'];

async function fetchScenes() {
  console.log('Buscando cenas Sentinel');
  let tempTar = fileUtils.createTempFile();
  let tempCSV = fileUtils.createTempFile();

  try {
    await fileUtils.download(SENTINEL2_METADATA_URL, tempTar.name);
    await unzip(tempTar.name, tempCSV.name);

    readCSV(tempCSV.name);
  } catch(e) {
    console.error('Erro ao processar arquivo CSV =(');
    console.error(e);
  } finally {
    tempTar.removeCallback();
    tempCSV.removeCallback();
  }
}

function unzip(path, dest) {
  console.log(`Extraindo ${path} para ${dest}`);
  return asyncGunzip(path, dest);
}

function readCSV(path) {
  console.log(`Lendo CSV ${path}`);

  // const stream = fs.createReadStream("/home/claudio/Downloads/sample.csv");
  const stream = fs.createReadStream(path);

  fastCSV
    .fromStream(stream, {headers: csvHeaders})
    .on("data", function(data){
      if (data && Object.keys(data).length === csvHeaders.length && data['granule_id'] !== 'GRANULE_ID') {
        new SentinelTile(data).save()
        .catch((err) => {
          console.log(`Erro ao processar registro ${err.toString()}`);
          console.log(data);
        });
      }
      else{
        console.log(`Erro ao processar registro ${data}`);
      }
    })
    .on("end", function(){
      console.log("done");
    });

}

exports.process = fetchScenes;