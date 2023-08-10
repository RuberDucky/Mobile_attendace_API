const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Upload Lecture Endpoint
router.post('/', async (req, res) => {
  const { subject, room, session, startTime, endTime, userId } = req.body;

  try {
    // Insert lecture data into the database
    const insertResult = await pool.promise().query(
      'INSERT INTO lectures (subject, room, session, start_time, end_time, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [subject, room, session, startTime, endTime, userId]
    );

    const lectureId = insertResult[0].insertId;

    // Fetch the newly inserted lecture data from the database
    const [lectureQueryResult] = await pool.promise().query('SELECT * FROM lectures WHERE lecture_id = ?', [lectureId]);

    if (lectureQueryResult.length === 0) {
      return res.status(404).json({
        code: 404,
        status: 'error',
        error: 'Lecture not found',
      });
    }

    const lecture = lectureQueryResult[0];

    res.status(201).json({
      code: 201,
      status: 'success',
      data: lecture,
    });
  } catch (error) {
    console.error('Error uploading lecture:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
