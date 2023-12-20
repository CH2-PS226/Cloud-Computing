const express = require('express');
const router = express.Router();
const uploadArtworkController = require('./uploadArtworkController');
const updateArtworkController = require('./updateArtworkController');
const getImage = require('./getImage');
const getArtworksController = require('./getArtworksController');
const deleteArtworkController = require('./deleteArtworkController');

router.post('/artworks', uploadArtworkController);
router.put('/artworks/:artwork_id', updateArtworkController);
router.get('/artworks', getArtworksController);
router.delete('/artworks/:artwork_id', deleteArtworkController);
router.use('/', getImage);


module.exports = router;
