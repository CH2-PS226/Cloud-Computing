const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../connection');

function deleteArtworkFile(imagePath, callback) {
  if (imagePath) {
    fs.unlink(imagePath, callback);
  } else {
    callback(null);
  }
}

router.delete('/artworks/:artwork_id', (req, res) => {
  const { artwork_id } = req.params;

  db.query('SELECT * FROM artworks WHERE artwork_id = ?', [artwork_id], (error, results) => {
    if (error) {
      console.error('Error fetching artwork:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const artwork = results[0];

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    deleteArtworkFile(artwork.image_url, (error) => {
      if (error) {
        console.error('Error deleting image file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const deleteQuery = 'DELETE FROM artworks WHERE artwork_id = ?';
      db.query(deleteQuery, [artwork_id], (error) => {
        if (error) {
          console.error('Error deleting artwork:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Artwork deleted successfully' });
      });
    });
  });
});

module.exports = router;
