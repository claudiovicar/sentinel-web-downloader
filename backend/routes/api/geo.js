var router = require('express').Router();
var sentinelSceneInfoDownloader = require('../../utils/sentinelSceneInfoDownloader');

router.get('/', (req, res, next) => {
    res.json({geo: 'Ok'});
});

router.get('/sentinel-grid', (req, res, next) => {
    let path = 'geojson/sentinel-grid.geojson';
    res.sendFile(path, {root: './public'});
});

router.get('/brasil', (req, res, next) => {
    let path = 'geojson/brasil.geojson';
    res.sendFile(path, {root: './public'});
});

router.post('/update', (req, res, next) => {
    sentinelSceneInfoDownloader.process();
    res.json({'ok': true});
    // let path = 'geojson/brasil.geojson';
    // res.sendFile(path, {root: './public'});
});

module.exports = router;