const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../connection');
const { resolve } = require('url');

router.get('/search', (req, res) => {
  const { title, description, tags } = req.query;
  let selectQuery = `
    SELECT * FROM artworks WHERE 1
  `;

  if (title) {
    selectQuery += ` AND title LIKE '%${title}%'`;
  }

  if (description) {
    selectQuery += ` AND description LIKE '%${description}%'`;
  }

  if (tags) {
    selectQuery += ` AND tags LIKE '%${tags}%'`;
  }

  db.query(selectQuery, (error, results) => {
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