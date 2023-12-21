const express = require('express');
const router = express.Router();
const uploadArtworkController = require('./uploadArtworkController');
const updateArtworkController = require('./updateArtworkController');
const getImage = require('./getImage');
const getArtworksByIdController = require('./getArtworksByIdController');
const getArtworksController = require('./getArtworksController');
const deleteArtworkController = require('./deleteArtworkController');
const getArtworksBySearch = require('./getArtworksBySearch');

router.get('/artworks/:user_id', getArtworksByIdController);
router.get('/search', getArtworksBySearch);
router.post('/artworks', uploadArtworkController);
router.put('/artworks/:artwork_id', updateArtworkController);
router.get('/artworks', getArtworksController);
router.delete('/artworks/:artwork_id', deleteArtworkController);
router.use('/', getImage);


module.exports = router;