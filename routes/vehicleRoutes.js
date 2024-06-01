const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to create a new vehicle
router.post('/', verifyToken, vehicleController.createVehicle);

// Route to get all vehicles
router.get('/', vehicleController.getAllVehicles);

// Route to get vehicle by ID
router.get('/:id', vehicleController.getVehicleById);

// Route to update vehicle by ID
router.put('/:id', verifyToken, vehicleController.updateVehicleById);

// Route to delete vehicle by ID
router.delete('/:id', verifyToken, vehicleController.deleteVehicleById);

module.exports = router;
