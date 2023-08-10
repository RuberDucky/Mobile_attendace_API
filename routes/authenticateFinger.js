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


router.post('/', async (req, res) => {
    const { user_id, fingerprint_data } = req.body;
  
    try {
      // Retrieve the stored hashed fingerprint from the database
      const [userData] = await pool.promise().query(
        'SELECT fingerprint FROM users WHERE user_id = ?',
        [user_id]
      );
  
      if (userData.length === 0) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          error: 'User not found',
        });
      }
  
      const storedFingerprint = userData[0].fingerprint;
  
      // Compare the received fingerprint with the stored fingerprint
      const isMatch = await bcrypt.compare(fingerprint_data, storedFingerprint);
  
      if (isMatch) {
        res.status(200).json({
          code: 200,
          status: 'success',
          message: 'Fingerprint authentication successful',
        });
      } else {
        res.status(401).json({
          code: 401,
          status: 'error',
          error: 'Fingerprint authentication failed',
        });
      }
    } catch (error) {
      console.error('Error authenticating fingerprint:', error);
      res.status(500).json({
        code: 500,
        status: 'error',
        error: 'Internal Server Error',
      });
    }
  });

  module.exports = router;