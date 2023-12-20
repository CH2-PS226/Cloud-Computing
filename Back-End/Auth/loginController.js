const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../connection');
require("dotenv").config();
const SECRET = `${process.env.SECRET_KEY}`;


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM catora_users WHERE username = ? AND password_hash = ?';
  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      const user_id = results[0].user_id;

      const token = jwt.sign({ user_id: user_id }, SECRET);

      res.status(200).json({ message: 'Login successful', user_id: user_id, token: token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

module.exports = router;
