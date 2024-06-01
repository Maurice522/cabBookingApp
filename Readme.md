# Cab Booking Application

This project is a cab booking application designed to facilitate the booking of rides between users and drivers. It allows users to book a cab for travel between specified pickup and drop-off locations, notifies drivers of new bookings, and maintains a history of bookings for users.

## Table of Contents
1. Features
2. Technologies Used
3. Setup
4. Usage
5. API Endpoints
6. Testing
7. Contributing
8. License

## Features
User Authentication: Users can sign up, log in, and receive OTP for authentication.
Booking System: Users can book a cab by providing pickup and drop-off locations.
Driver Management: Drivers are managed separately with a booking history.
SMS Notifications: Drivers receive SMS notifications for new bookings.
User Booking History: Users can view their booking history.

### Technologies Used
Node.js: JavaScript runtime environment
Express.js: Web application framework for Node.js
MongoDB: NoSQL database for storing user, driver, and booking data
Mongoose: MongoDB object modeling for Node.js
Jest & Supertest: Testing framework and HTTP assertions for API testing
Twilio: SMS communication API (currently commented out due to non-working Twilio account)
Setup

### Clone the repository:

bash
Copy code
git clone https://github.com/Maurice522/cabBookingApp.git
cd cab-booking-app
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cab-booking-db
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
Note: Twilio-related variables are optional and can be left empty for local development without SMS functionality.

Start the server:

bash
Copy code
npm start
Running tests:

bash
Copy code
npm test
Usage
Register a user and obtain OTP for authentication.
Log in with registered credentials.
Book a cab by providing pickup and drop-off locations.
View booking history.

## API Endpoints

POST /api/auth/signup: Register a new user.
POST /api/auth/login: Log in with existing user credentials.

POST /api/bookings: Book a cab (requires authentication).
GET /api/bookings/history: View booking history (requires authentication).

POST /api/vehicles/: create a new vehicle (requires authentication).
GET /api/vehicles/: get all vehicles 
GET /api/vehicles/:id: get vehicle by ID
PUT /api/vehicles/:id: update vehicle by ID (requires authentication).
DELETE /api/vehicles/:id: delete vehicle by ID (requires authentication).

POST /api/offers/: To add offer (requires authentication).
POST /api/offers/apply: To apply offer (requires authentication).

GET /api/wallet/balance: To get balance (requires authentication).
POST /api/wallet/add: To add balance (requires authentication).

POST /api/payment/initiate: to initiate payment (requires authentication).
POST /api/payment/confirm: to confirm payment (requires authentication).

### Testing
Unit tests for controllers and models are located in the test directory.
Use Jest and Supertest for testing.
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.
