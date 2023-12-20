const express = require('express');
const router = express.Router();
const getProfileController = require('./getProfileController');
const updateProfileController = require('./updateProfileController');
const getImage = require('./getImage');

router.get('/profile/:user_id', getProfileController);
router.put('/profile/:user_id', updateProfileController);
router.use('/', getImage);

module.exports = router;
