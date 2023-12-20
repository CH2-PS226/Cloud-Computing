const express = require('express');
const router = express.Router();
const loginController = require('./loginController');
const registerController = require('./registerController');
const logoutController = require('./logoutController');

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);

module.exports = router;
