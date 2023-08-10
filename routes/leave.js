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

// Submit Leave Endpoint
router.post('/', async (req, res) => {
  const { user_id, start_date, end_date, reason } = req.body;

  try {
    // Insert the leave request data into the database
    const insertResult = await pool.promise().query(
      'INSERT INTO leave_requests (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
      [user_id, start_date, end_date, reason]
    );

    const requestId = insertResult[0].insertId;

    // Fetch the newly inserted leave request from the database
    const [requestQueryResult] = await pool.promise().query(
      'SELECT * FROM leave_requests WHERE request_id = ?',
      [requestId]
    );

    if (requestQueryResult.length === 0) {
      return res.status(404).json({
        code: 404,
        status: 'error',
        error: 'Leave request not found',
      });
    }

    const leaveRequest = requestQueryResult[0];

    res.status(200).json({
      code: 200,
      status: 'success',
      data: leaveRequest,
    });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
