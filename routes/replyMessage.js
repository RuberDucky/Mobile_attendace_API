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
    const { sender_id, message_id, message } = req.body;

    try {
      // Fetch the original message
      const [originalMessage] = await pool.promise().query(
        'SELECT * FROM messages WHERE message_id = ?',
        [message_id]
      );
  
      if (originalMessage.length === 0) {
        return res.status(404).json({
          code: 404,
          status: 'error',
          error: 'Original message not found',
        });
      }
  
      // Insert the reply message data into the database
      const insertResult = await pool.promise().query(
        'INSERT INTO messages (sender_id, recipient_id, message, is_reply_to) VALUES (?, ?, ?, ?)',
        [sender_id, originalMessage[0].sender_id, message, message_id]
      );
  
      res.status(201).json({
        code: 201,
        status: 'success',
        message: 'Message replied successfully',
      });
    } catch (error) {
      console.error('Error replying to message:', error);
      res.status(500).json({
        code: 500,
        status: 'error',
        error: 'Internal Server Error',
      });
    }
  // Reply to Message Endpoint code...
});

module.exports = router;
