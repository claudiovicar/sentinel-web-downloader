/**
 * Class for downloading and parsing the .CSV file with scene info from GoogleCloud
 */

const {promisify} = require('util');
const fileUtils = require('./fileUtils');
const asyncGunzip = promisify(require('gunzip-file'));
const fastCSV = require('fast-csv');
const fs = require('fs');

const SentinelScene = require('../models/SentinelScene');
const SentinelTile = require('../models/SentinelTile');
const SentinelUpdate = require('../models/SentinelUpdate');

const SENTINEL2_METADATA_URL = process.env.SENTINEL2_METADATA_URL;
// const SENTINEL2_METADATA_URL = 'http://storage.googleapis.com/gcp-public-data-sentinel-2/index.csv.gz';
// const SENTINEL2_METADATA_URL = 'http://ufpr.dl.sourceforge.net/project/od1n/samples.tar.gz';

// https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/18/M/ZD/2018/11/12/0/preview.jpg

const csvHeaders = ['granule_id', 'product_id', 'datatake_identifier', 'tile_id', 'sensing_time', 'total_size', 'cloud_cover',
'geometric_quality_flag', 'generation_time', 'north_lat', 'south_lat', 'west_lon', 'east_lon', 'base_url'];

let tileIDs = [];

async function fetchScenes() {

  const newUpdate = new SentinelUpdate();
  await newUpdate.save();

  console.log('Carregando ids dos tiles de interesse');
  fillTileIds();
  // console.log(tileIDs);

  console.log(`Buscando cenas Sentinel ${SENTINEL2_METADATA_URL}`);
  let tempTar = fileUtils.createTempFile();
  let tempCSV = fileUtils.createTempFile();

  newUpdate.status = 'IN_PROGRESS';
  await newUpdate.save();

  try {
    console.log('Baixando...');
    await fileUtils.download(SENTINEL2_METADATA_URL, tempTar.name, {});
    console.log('Extraindo...');
    await unzip(tempTar.name, tempCSV.name);
    const lastUpdateDate = await getLastSuccessfulUpdateDate();

    await readAndInsertCSV(tempCSV.name, lastUpdateDate);

    newUpdate.status = 'DONE';
  } catch(e) {
    console.error('Erro ao processar arquivo CSV =(');
    console.error(e);
    newUpdate.status = 'ERROR';
  } finally {
    tempTar.removeCallback();
    tempCSV.removeCallback();
    newUpdate.date = new Date();
    await newUpdate.save();
  }

}

function unzip(path, dest) {
  console.log(`Extraindo ${path} para ${dest}`);
  return asyncGunzip(path, dest);
}

// TODO: Transformar em async
async function readAndInsertCSV(path, lastUpdateDate) {

  console.log(`Lendo CSV ${path}`);
  console.log(`Última atualização em ${lastUpdateDate}`);

  // const stream = fs.createReadStream("/home/claudio/Downloads/sample.csv");
  const stream = fs.createReadStream(path);

  let registers = [];

  // TODO: Obter último id ou data inserida no banco.
  // No on("data"), abaixo, limitar àqueles não inseridos ainda.

  return new Promise((resolve, reject) => {

    try {

      fastCSV
      .fromStream(stream, {headers: csvHeaders})
      .on("data", function(scene){
        if (scene && Object.keys(scene).length === csvHeaders.length && scene['granule_id'] !== 'GRANULE_ID') {
          // TODO: Colocar findOne do tile em um cache
          if(shouldAddTile(scene.tile_id)) {
            SentinelTile.findOne({id: scene.tile_id}).exec()
            .then(tile => {

              scene.tile = tile;

              if(!lastUpdateDate || new Date(scene.sensing_time) > lastUpdateDate)
                registers.push(scene);
              // else
              //   console.log(`Ignorando cena ${scene.granule_id}`)

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
          console.log(`Erro ao processar registro ${JSON.stringify(scene)}`);
        }
      })
      .on("end", function(){
        console.log("Done reading CSV.");
        resolve();
      });

    }
    catch(err) {
      reject(err);
    }

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

    SentinelTile.findOneOrCreate({id: feature.properties.TileID});
    // new SentinelTile({id: feature.properties.TileID}).save();

  });

}

/**
 * Inserts only the desired tiles, based on the source GeoJSON
 */
function shouldAddTile(tileId) {
  return tileIDs.indexOf(tileId) >= 0;
}

function getLastSuccessfulUpdateDate() {
  return SentinelUpdate.lastSuccessfulUpdate()
    .then(lastUpdate => {
      return lastUpdate.date;
    })
    .catch(err => {
      return null;
    });
}

exports.process = fetchScenes;