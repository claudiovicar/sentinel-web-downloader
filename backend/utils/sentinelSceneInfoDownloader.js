/**
 * Class for downloading and parsing the .CSV file with scene info from GoogleCloud
 *
 */

const {promisify} = require('util');
const fileUtils = require('./fileUtils');
const asyncGunzip = promisify(require('gunzip-file'));
const fastCSV = require('fast-csv');
const fs = require('fs');

const SentinelScene = require('../models/SentinelScene');
const SentinelTile = require('../models/SentinelTile');

const SENTINEL2_METADATA_URL = process.env.SENTINEL2_METADATA_URL;
// const SENTINEL2_METADATA_URL = 'http://storage.googleapis.com/gcp-public-data-sentinel-2/index.csv.gz';
// const SENTINEL2_METADATA_URL = 'http://ufpr.dl.sourceforge.net/project/od1n/samples.tar.gz';

// https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/18/M/ZD/2018/11/12/0/preview.jpg

const csvHeaders = ['granule_id', 'product_id', 'datatake_identifier', 'tile_id', 'sensing_time', 'total_size', 'cloud_cover',
'geometric_quality_flag', 'generation_time', 'north_lat', 'south_lat', 'west_lon', 'east_lon', 'base_url'];

let tileIDs = [];

async function fetchScenes() {

  console.log('Carregando ids dos tiles de interesse');
  fillTileIds();
  // console.log(tileIDs);

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

  let registers = [];

  fastCSV
    .fromStream(stream, {headers: csvHeaders})
    .on("data", function(data){
      if (data && Object.keys(data).length === csvHeaders.length && data['granule_id'] !== 'GRANULE_ID') {

        if(tileIDs.indexOf(data.tile_id) >= 0) {
          SentinelTile.findOne({id: data.tile_id}).exec()
          .then(tile => {

            data.tile = tile;
            registers.push(data);

            if (registers.length > 1000) {
              console.log("Inserting in the database...");
              SentinelScene.insertMany(registers)
                .then(() => {console.log('Dados inseridos com sucesso!');})
                .catch((e) => {
                  console.error('Erro ao inserir dados no banco.');
                  console.error(e);
                });
              registers = [];
            }

          });
        }

      }
      else{
        console.log(`Erro ao processar registro ${JSON.stringify(data)}`);
      }
    })
    .on("end", function(){
      console.log("Done reading CSV.");
    });

}

// Abre o geojson do brasil
// Extrai os tile_ids
// Insere em um array
// TODO: Colocar o path do geojson do brasil no .env
function fillTileIds() {

  let geojson = JSON.parse(fs.readFileSync('public/geojson/sentinel-grid.geojson', 'utf8'));

  geojson.features.forEach(feature => {

    tileIDs.push(feature.properties.TileID);

    new SentinelTile({id: feature.properties.TileID}).save();

  });

}

exports.process = fetchScenes;