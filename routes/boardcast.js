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

router.post('/', async (req, res) => {
  const { user_id, date, message, admin_name } = req.body;

  try {
    // Check if the user with the given user_id exists
    const [userExists] = await pool.promise().query(
      'SELECT * FROM users WHERE user_id = ?',
      [user_id]
    );

    if (userExists.length === 0) {
      return res.status(404).json({
        code: 404,
        status: 'error',
        error: 'User not found',
      });
    }

    // Insert the broadcast message into the database
    const insertResult = await pool.promise().query(
      'INSERT INTO broadcasts (user_id, date, message, admin_name) VALUES (?, ?, ?, ?)',
      [user_id, date, message, admin_name]
    );

    res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Broadcast message sent successfully',
    });
  } catch (error) {
    console.error('Error sending broadcast message:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
