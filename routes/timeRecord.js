const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Check-in and Check-out Endpoint
router.post('/', async (req, res) => {
  const { user_id, location_checkin, location_checkout, checkIn, checkOut, date, latitude, longitude } = req.body;

  try {
    // Insert the check-in and check-out data into the database
    const insertResult = await pool.promise().query(
      'INSERT INTO timerecord (user_id, location_checkin, location_checkout, checkIn, checkOut, date, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, location_checkin, location_checkout, checkIn, checkOut, date, latitude, longitude]
    );

    const recordId = insertResult[0].insertId;

    // Fetch the newly inserted record from the database
    const [recordQueryResult] = await pool.promise().query('SELECT * FROM timerecord WHERE record_id = ?', [recordId]);

    if (recordQueryResult.length === 0) {
      return res.status(404).json({ code: 404, status: 'error', error: 'Record not found' });
    }

    const record = recordQueryResult[0];

    res.status(200).json({
      code: 200,
      status: 'success',
      data: record,
    });
  } catch (error) {
    console.error('Error during recording:', error);
    res.status(500).json({ code: 500, status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = router;
