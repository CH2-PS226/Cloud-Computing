const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../connection');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/Back-End/Event/banner`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/add_event', upload.single('event_banner'), (req, res) => {
  const { event_name, description } = req.body;
  const event_banner = req.file.path;

  const insertQuery = `
    INSERT INTO catora_events (event_name, description, event_banner)
    VALUES (?, ?, ?)
  `;

  db.query(insertQuery, [event_name, description, event_banner], (error, results) => {
    if (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'Event added successfully' });
  });
});

module.exports = router;
