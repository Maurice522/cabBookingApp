// mockData.js

// Mock data for User
const mockUser = {
    _id: '665b90304e011f1821d65cd3',
    phoneNumber: '1234567890', // Add any other necessary fields
};

// Mock data for Driver
const mockDriver = {
    _id: '665b983dcfb0450137bfdb7d',
    name: 'Mock Driver',
    email: 'mockdriver@example.com',
    phoneNumber: '9876543210',
    vehicle: 'mockVehicleId', // Replace with actual ObjectId of mock vehicle
    bookingHistory: ['mockBookingId1', 'mockBookingId2'] // Replace with actual ObjectIds of mock bookings
};

module.exports = { mockUser, mockDriver };
