const express = require('express');
const { getDeliveryStaffDetails } = require('../controllers/deliveryController');
const  authenticate  = require('../middleware/protect'); // Middleware to verify JWT token

const router = express.Router();

// Route to get pantry staff details (Only accessible by Managers)
router.get('/get-delivery',authenticate, getDeliveryStaffDetails);

module.exports = router;
