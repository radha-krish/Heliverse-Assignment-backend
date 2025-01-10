const express = require('express');
const { getPantryStaffDetails } = require('../controllers/pantryController');
const  authenticate  = require('../middleware/protect'); // Middleware to verify JWT token

const router = express.Router();

// Route to get pantry staff details (Only accessible by Managers)
router.get('/get-pantry',authenticate, getPantryStaffDetails);

module.exports = router;
