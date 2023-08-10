# Mobile Attendance System API

The Mobile Attendance System API is a Node.js application that provides various endpoints to manage user authentication, attendance tracking, messaging, lectures, and more. It serves as the backend for the mobile attendance system application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone this repository:

```
git clone https://github.com/your-username mobile-attendance-system-api.git
```


2. Install the dependencies:

```
cd mobile-attendance-system-api
```
```
npm install
```

3. Set up your environment variables by creating a `.env` file in the root directory:
```plaintext
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_PORT=3306
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```
4. also make the Folder of uploads/userProfilePic

```npm start
```

## Usage

The API provides various endpoints to manage user authentication, attendance tracking, messaging, lectures, and more. You can make HTTP requests to these endpoints using tools like `curl` or by integrating them into your mobile app.

## Endpoints

- Authentication:
  - `POST /signup`: Register a new user.
  - `POST /login`: User login.

- Attendance Tracking:
  - `POST /api/attendance/checkin`: User check-in.
  - `POST /api/attendance/checkout`: User check-out.

- Messaging:
  - `POST /api/messages/send`: Send a message to a user's inbox.
  - `POST /api/messages/reply`: Reply to a message in the user's inbox.
  - `POST /api/messages/inbox/:user_id`: Get messages in a user's inbox.

- Lectures:
  - `POST /api/lectures/upload`: Upload lecture details.

- Fingerprints:
  - `POST /api/fingerprints/enroll`: Enroll user fingerprint.
  - `POST /api/fingerprints/authenticate`: Authenticate user fingerprint.

- Broadcast:
  - `POST /api/broadcast/send`: Send a broadcast message.

#
## Contributing
```
Contributions are welcome! If you find any issues or want to add new features, feel free to submit a pull request.
```
Replace placeholders like `your-username`, `your_database_user`, `your_database_password`, `your_database_name`, `your_twilio_account_sid`, and `your_twilio_auth_token` with actual values.

Remember to adjust the content and structure of the `README.md` file to fit your project's specifics. This is just a template to get you started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.