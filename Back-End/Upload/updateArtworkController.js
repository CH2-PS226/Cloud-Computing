const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../connection');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/images`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.put('/artworks/:artwork_id', upload.single('image'), (req, res) => {
  const { artwork_id } = req.params;
  const { title, description, tags } = req.body;
  const image_url = req.file.path;

  db.query('SELECT * FROM artworks WHERE artwork_id = ?', [artwork_id], (error, results) => {
    if (error) {
      console.error('Error fetching artwork:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const artwork = results[0];

    fs.unlink(artwork.image_url, (error) => {
      if (error) {
        console.error('Error deleting image file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const updateQuery = `
        UPDATE artworks
        SET title = ?, description = ?, tags = ?, image_url = ?
        WHERE artwork_id = ?
      `;

      db.query(updateQuery, [title, description, tags, image_url, artwork_id], (error, results) => {
        if (error) {
          console.error('Error updating artwork:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Artwork updated successfully' });
      });
    });
  });
});

module.exports = router;