const Vehicle = require('../models/vehicleModel');

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { name, cancellability, waitingTime, extraKmFare, driver, reviews, ratings } = req.body;

        // Validate required fields
        if (!name || !cancellability || !waitingTime || !extraKmFare || !driver || !reviews || !ratings) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new vehicle instance
        const newVehicle = new Vehicle({
            name,
            cancellability,
            waitingTime,
            extraKmFare,
            driver,
            reviews,
            ratings
        });

        // Save the vehicle to the database
        await newVehicle.save();

        // Respond with the new vehicle details
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        // Fetch all vehicles from the database
        const vehicles = await Vehicle.find();

        // Respond with the list of vehicles
        res.status(200).json({ vehicles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the vehicle by ID
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Respond with the vehicle details
        res.status(200).json({ vehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update vehicle by ID
exports.updateVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cancellability, waitingTime, extraKmFare, driver, reviews, ratings } = req.body;

        // Find the vehicle by ID
        let vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Update the vehicle fields
        vehicle.name = name;
        vehicle.cancellability = cancellability;
        vehicle.waitingTime = waitingTime;
        vehicle.extraKmFare = extraKmFare;
        vehicle.driver = driver;
        vehicle.reviews = reviews;
        vehicle.ratings = ratings;

        // Save the updated vehicle to the database
        await vehicle.save();

        // Respond with the updated vehicle details
        res.status(200).json({ message: 'Vehicle updated successfully', vehicle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete vehicle by ID
exports.deleteVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the vehicle by ID and delete it
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Vehicle deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
