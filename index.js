const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./Back-End/Auth/authController');
const profileController = require('./Back-End/Profile/profileController');
const uploadController = require('./Back-End/Upload/uploadController');
const eventController = require('./Back-End/Event/eventController');
const paymentController = require('./Back-End/payment/app');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authController);
app.use('/profile', profileController);
app.use('/upload', uploadController);
app.use('/event', eventController);
app.use('/payment', paymentController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});