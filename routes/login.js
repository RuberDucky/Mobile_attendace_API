const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();
// const twilio = require('twilio'); // Commented out Twilio import
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); // Commented out Twilio client creation

// Generate a 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Login OTP Endpoint
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const [userQueryResult] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (userQueryResult.length === 0) {
      return res.status(404).json({ code: 404, status: 'error', error: 'User not found' });
    }

    const user = userQueryResult[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, status: 'error', error: 'Invalid password' });
    }

    // Fetch user's phone number from the database
    const [phoneNumberQueryResult] = await pool.promise().query('SELECT phone_number FROM users WHERE user_id = ?', [user.user_id]);
    if (phoneNumberQueryResult.length === 0 || !phoneNumberQueryResult[0].phone_number) {
      return res.status(400).json({ code: 400, status: 'error', error: 'Phone number not found for the user' });
    }

    // const phoneNumber = phoneNumberQueryResult[0].phone_number; // Commented out fetching phone number from the database

    // Generate a 4-digit OTP
    const otp = generateOTP();

    // You can save the OTP in the database or in-memory cache for verification
    // Here, I'm just sending it in the response
    const responseData = {
      user_id: user.user_id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      profile_pic: user.profile_pic || null,
      phone_number: user.phone_number || null,
      otp: otp,
    };

    // Sending OTP via SMS
    // Make sure to set up Twilio credentials in your .env file
    // and install the 'twilio' package
    // const message = await client.messages.create({
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   body: `Your OTP for login is: ${otp}`,
    // });

    // console.log(message.sid);

    res.status(200).json({
      code: 200,
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ code: 500, status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = router;
