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

router.post('/artworks', upload.single('image'), (req, res) => {
  const { user_id, title, description, tags } = req.body;
  const image_url = req.file.path;

  const insertQuery = `
    INSERT INTO artworks (user_id, title, description, tags, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [user_id, title, description, tags, image_url], (error, results) => {
    if (error) {
      console.error('Error creating artwork:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'Artwork created successfully' });
  });
});

module.exports = router;