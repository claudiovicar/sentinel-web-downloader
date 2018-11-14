var router = require('express').Router();
var sentinelDownloader = require('../../utils/sentinelDownloader')

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

router.get('/update', (req, res, next) => {
    sentinelDownloader.process();
    res.json({'ok': true});
    // let path = 'geojson/brasil.geojson';
    // res.sendFile(path, {root: './public'});
});

module.exports = router;