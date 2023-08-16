const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Generate a 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Serve static files from the 'uploads/userProfilePic' directory
router.use('/uploads/userProfilePic', express.static(path.join(__dirname, '..', 'uploads/userProfilePic')));

// Signup Endpoint
router.post('/', async (req, res) => {
  const { email, password, confirmPassword, first_name, last_name, fingerprint_data, profile_pic, phone_number } = req.body;

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ code: 400, status: 'error', error: 'Passwords do not match' });
  }

  try {
    // Check if the email already exists in the database
    const emailExistsResult = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailExistsResult[0].length > 0) {
      return res.status(409).json({ code: 409, status: 'error', error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash the fingerprint data for storage
    const hashedFingerprint = await bcrypt.hash(fingerprint_data, 10);

    // Insert the new user data into the database, including fingerprint data
    const insertResult = await pool.promise().query(
      'INSERT INTO users (email, password, first_name, last_name, phone_number, fingerprint) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, first_name, last_name, phone_number, hashedFingerprint]
    );

    const userId = insertResult[0].insertId;

    // ... (rest of the code for saving profile picture, updating profile_pic, etc.)

    // Fetch the newly inserted user data from the database
    const [userQueryResult] = await pool.promise().query('SELECT * FROM users WHERE user_id = ?', [userId]);

    if (userQueryResult.length === 0) {
      return res.status(404).json({ code: 404, status: 'error', error: 'User not found' });
    }

    const user = userQueryResult[0];

    // Construct the response data object
    const responseData = {
      user_id: user.user_id,
      email: user.email,
      profile_pic: user.profile_pic || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      phone_number: user.phone_number || null,
    };

    res.status(200).json({
      code: 200,
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ code: 500, status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = router;
