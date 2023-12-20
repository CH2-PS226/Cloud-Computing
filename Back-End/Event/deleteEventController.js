const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../connection');

function deleteEventFile(imagePath, callback) {
  if (imagePath) {
    fs.unlink(imagePath, callback);
  } else {
    callback(null);
  }
}

router.delete('/delete_event/:id_event', (req, res) => {
  const { id_event } = req.params;

  db.query('SELECT * FROM catora_events WHERE id_event = ?', [id_event], (error, results) => {
    if (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const event = results[0];

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    deleteEventFile(event.event_banner, (error) => {
      if (error) {
        console.error('Error deleting image file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const deleteQuery = 'DELETE FROM catora_events WHERE id_event = ?';
      db.query(deleteQuery, [id_event], (error) => {
        if (error) {
          console.error('Error deleting event:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Event deleted successfuly' });
      });
    });
  });
});

module.exports = router;
