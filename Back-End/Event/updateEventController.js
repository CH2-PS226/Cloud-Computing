const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

router.put('/update_event/:id_event', upload.single('event_banner'), (req, res) => {
  const { id_event } = req.params;
  const { event_name, description } = req.body;
  const event_banner = req.file.path;

  db.query('SELECT * FROM catora_events WHERE id_event = ?', [id_event], (error, results) => {
    if (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const event = results[0];

    fs.unlink(event.event_banner, (error) => {
      if (error) {
        console.error('Error deleting image file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const updateQuery = `
        UPDATE catora_events
        SET event_name = ?, description = ?, event_banner = ?
        WHERE id_event = ?
      `;

      db.query(updateQuery, [event_name, description, event_banner, id_event], (error, results) => {
        if (error) {
          console.error('Error updating event:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Event updated successfuly' });
      });
    });
  });
});

module.exports = router;
