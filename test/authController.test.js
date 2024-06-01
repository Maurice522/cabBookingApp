const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

jest.mock('twilio');

describe('Auth Controller', () => {
    let sendMock;

    beforeEach(() => {
        sendMock = jest.fn();
        twilio.mockReturnValue({
            messages: {
                create: sendMock
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Signup', () => {
        it('should create a new user and send OTP', async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue({});

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ phoneNumber: '1234567890', name:"maurice" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User created successfully, OTP sent to your phone');
            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(User.prototype.save).toHaveBeenCalledTimes(1);
        });

        it('should return error if user already exists', async () => {
            User.findOne = jest.fn().mockResolvedValue({ phone: '1234567890' });

            const response = await request(app)
                .post('/api/auth/signup')
                .send({ phone: '1234567890' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
            expect(User.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('Login', () => {
        it('should login a user and return a JWT token', async () => {
            const user = {
                _id: 'someUserId',
                phone: '1234567890',
                otp: '123456'
            };

            User.findOne = jest.fn().mockResolvedValue(user);
            jwt.sign = jest.fn().mockReturnValue('fake-jwt-token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({ phone: '1234567890', otp: '123456' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'fake-jwt-token');
            expect(User.findOne).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        });

        it('should return error if credentials are invalid', async () => {
            User.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ phone: '1234567890', otp: '123456' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
            expect(User.findOne).toHaveBeenCalledTimes(1);
        });
    });
});
