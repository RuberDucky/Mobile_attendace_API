const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const pool = mysql.createPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Generate a 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Serve static files from the 'uploads/userProfilePic' directory
router.use('/uploads/userProfilePic', express.static(path.join(__dirname, '..', 'uploads/userProfilePic')));

// Signup Endpoint
router.post('/', async (req, res) => {
  const { email, password, confirmPassword, first_name, last_name, profile_pic } = req.body;

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ code: 400, status: 'error', error: 'Passwords do not match' });
  }

  try {
    // Check if the email already exists in the database
    const emailExistsResult = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (emailExistsResult[0].length > 0) {
      return res.status(409).json({ code: 409, status: 'error', error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user data into the database
    const insertResult = await pool.promise().query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, first_name, last_name]
    );

    const userId = insertResult[0].insertId;

    // Decode and save the profile picture
    const profilePicPath = path.join(__dirname, '..', 'uploads/userProfilePic');
    const profilePicFilename = `${Date.now()}_${generateOTP()}.png`; // You can use a unique filename
    const profilePicFilePath = path.join(profilePicPath, profilePicFilename);

    const profilePicData = profile_pic.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(profilePicFilePath, profilePicData, { encoding: 'base64' });

    // Construct the profile_pic URL
    const profilePicUrl = `/uploads/userProfilePic/${profilePicFilename}`;

    // Update the profile_pic column in the users table with the URL
    await pool.promise().query('UPDATE users SET profile_pic = ? WHERE user_id = ?', [profilePicUrl, userId]);

    // Fetch the newly inserted user data from the database
    const [userQueryResult] = await pool.promise().query('SELECT * FROM users WHERE user_id = ?', [userId]);

    if (userQueryResult.length === 0) {
      return res.status(404).json({ code: 404, status: 'error', error: 'User not found' });
    }

    const user = userQueryResult[0];

    // Construct the response data object
    const responseData = {
      user_id: user.user_id,
      email: user.email,
      profile_pic: user.profile_pic || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
    };

    res.status(200).json({
      code: 200,
      status: 'success',
      data: responseData,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ code: 500, status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = router;
