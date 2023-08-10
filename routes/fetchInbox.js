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
  const { user_id } = req.body;

  try {
    // Fetch messages for the user's inbox
    const [inboxMessages] = await pool.promise().query(
      'SELECT * FROM messages WHERE recipient_id = ? ORDER BY timestamp DESC',
      [user_id]
    );

    res.status(200).json({
      code: 200,
      status: 'success',
      data: inboxMessages,
    });
  } catch (error) {
    console.error('Error fetching inbox messages:', error);
    res.status(500).json({
      code: 500,
      status: 'error',
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
