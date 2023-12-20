const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../connection');
const { resolve } = require('url');
require("dotenv").config();

router.get('/get_event', (req, res) => {
  const selectQuery = `
    SELECT * FROM catora_events
  `;

  db.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const eventsWithResolvedUrls = results.map((event) => {
      const resolvedImageUrl = event.event_banner
        ? resolve(`${process.env.DNS}/event/banner/`, path.basename(event.event_banner))
        : null;
      return {
        ...event,
        event_banner: resolvedImageUrl,
        id_event: event.id_event || null,
      };
    });

    res.status(200).json(eventsWithResolvedUrls);
  });
});

module.exports = router;
