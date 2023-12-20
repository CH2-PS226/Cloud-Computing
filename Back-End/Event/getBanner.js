const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/banner/:nameFile', (req, res) => {
  const { nameFile } = req.params;
  const image = path.join(__dirname, './banner/') + nameFile;

  res.status(200).sendFile(image)
});

module.exports = router;
