const express = require('express');
const router = express.Router();
const db = require('../connection');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const checkUsernameQuery = 'SELECT * FROM catora_users WHERE username = ?';
  db.query(checkUsernameQuery, [username], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking username:', checkError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const insertUserQuery = 'INSERT INTO catora_users (username, password_hash) VALUES (?, ?)';
    db.query(insertUserQuery, [username, password], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error executing registration query:', insertError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const userId = insertResults.insertId;

      const insertProfileQuery = 'INSERT INTO catora_user_profiles (user_id, artist_name, description) VALUES (?, ?, ?)';
      db.query(insertProfileQuery, [userId, 'Catora', 'Catora'], (profileError) => {
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({ message: 'Registration successful' });
      });
    });
  });
});

module.exports = router;
