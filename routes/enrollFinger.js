const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Enrollment Endpoint
router.post('/', async (req, res) => {
  const { user_id, fingerprint_data } = req.body;

  try {
    // Hash the fingerprint data for storage
    const hashedFingerprint = await bcrypt.hash(fingerprint_data, 10);

    // Store the hashed fingerprint in the database
    await pool.promise().query(
      'UPDATE users SET fingerprint = ? WHERE user_id = ?',
      [hashedFingerprint, user_id]
    );

    res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Fingerprint enrolled successfully',
    });
  } catch (error) {
    console.error('Error enrolling fingerprint:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      error: 'Internal Server Error',
    });
  }
});

// Authentication Endpoint


module.exports = router;
