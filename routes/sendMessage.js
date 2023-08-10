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
    const { sender_id, recipient_id, message } = req.body;

    try {
      // Insert the message data into the database
      const insertResult = await pool.promise().query(
        'INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)',
        [sender_id, recipient_id, message]
      );
  
      res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Message sent successfully',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        code: 500,
        status: 'error',
        error: 'Internal Server Error',
      });
    }
  // Send Message Endpoint code...
});

module.exports = router;
