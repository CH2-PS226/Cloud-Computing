const express = require('express');
const router = express.Router();
const createEventController = require('./createEventController');
const getEventController = require('./getEventController');
const updateEventController = require('./updateEventController');
const deleteEventController = require('./deleteEventController');
const getBanner = require('./getBanner');

router.post('/add_event', createEventController);
router.put('/update_event/:id_event', updateEventController);
router.get('/get_event', getEventController);
router.delete('/delete_event/:id_event', deleteEventController);
router.use('/', getBanner);

module.exports = router;