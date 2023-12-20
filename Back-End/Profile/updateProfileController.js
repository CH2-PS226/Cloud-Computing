const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../connection');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/Back-End/Profile/Image`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.put('/profile/:user_id', upload.fields([{ name: 'profile_image', maxCount: 1 }, { name: 'background_image', maxCount: 1 }]), (req, res) => {
  const { user_id } = req.params;
  const { artist_name, description } = req.body;

  const profile_image_url = req.files['profile_image'] ? req.files['profile_image'][0].path : null;
  const background_image_url = req.files['background_image'] ? req.files['background_image'][0].path : null;

  if (!user_id || (!artist_name && !description && !profile_image_url && !background_image_url)) {
    return res.status(400).json({ error: 'Missing required fields for update' });
  }

  const updateProfileQuery = `
    UPDATE catora_user_profiles
    SET artist_name = COALESCE(?, artist_name),
        description = COALESCE(?, description),
        profile_image_url = COALESCE(?, profile_image_url),
        background_image_url = COALESCE(?, background_image_url)
    WHERE user_id = ?
  `;

  db.query(
    updateProfileQuery,
    [artist_name, description, profile_image_url, background_image_url, user_id],
    (error, results) => {
      if (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;
