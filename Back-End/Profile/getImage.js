const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/images/:nameFile', (req, res) => {
  const { nameFile } = req.params;
  const image = path.join(__dirname, './Image/') + nameFile;

  res.status(200).sendFile(image)
});

module.exports = router;
