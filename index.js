const express = require('express');
const cors = require('cors');


const app = express();
const port = 8000; // You can change the port if needed

// Middleware
app.use(express.json()); // Replace bodyParser with express.json()
app.use(cors());

// Database configuration using environment variables



// Route files
const signupRoute = require('./routes/signupuser');
const loginRoute  = require('./routes/login');
const timerecord =  require('./routes/timeRecord');
const submitleave = require('./routes/leave');
const sendMessageRoute = require('./routes/sendMessage');
const fetchInboxRoute = require('./routes/fetchInbox');
const replyMessageRoute = require('./routes/replyMessage');
const broadcastMessage = require('./routes/boardcast');
const authenticateFinger  = require('./routes/authenticateFinger');
const enrollFinger = require('./routes/enrollFinger');
const lectureRoute = require('./routes/lecture');




// Use the route files
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/timerecord', timerecord);
app.use('/submitleave', submitleave);
app.use('/send', sendMessageRoute);
app.use('/inbox', fetchInboxRoute);
app.use('/reply', replyMessageRoute);
app.use('/broadcast', broadcastMessage);
app.use('/authenticate', authenticateFinger);
app.use('/enroll', enrollFinger);
app.use('/lectures', lectureRoute);


// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});



app.listen(port, () => {
  console.log(`Server running on http://192.168.1.22:${port}`);
});
