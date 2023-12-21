const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../connection');
const { resolve } = require('url');

router.get('/artworks/:user_id', (req, res) => {
  const { user_id } = req.params;
  const selectQuery = `
    SELECT * FROM artworks WHERE user_id = ?
  `;

  db.query(selectQuery, [user_id], (error, results) => {
    if (error) {
      console.error('Error fetching artworks:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const artworksWithResolvedUrls = results.map((artwork) => {
      const resolvedImageUrl = artwork.image_url
        ? resolve(`${process.env.DNS}/upload/images/`, path.basename(artwork.image_url))
        : null;
      return {
        ...artwork,
        image_url: resolvedImageUrl,
        id: artwork.id || null,
      };
    });

    res.status(200).json(artworksWithResolvedUrls);
  });
});

module.exports = router;