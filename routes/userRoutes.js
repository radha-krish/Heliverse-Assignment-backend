const express = require('express');
const { registerUser, loginUser, getProfile ,getUniqueLocationsByRole,getUsersByLocationAndRole} = require('../controllers/userController');
const authenticate = require('../middleware/protect');

const router = express.Router();

// Public routes
router.post('/register',authenticate, registerUser);
router.post('/login', loginUser);

// Protected route example
router.get('/profile', authenticate, getProfile);
router.post("/get-loc",authenticate,getUniqueLocationsByRole)
router.post("/get-userByLocationRole",authenticate,getUsersByLocationAndRole)


module.exports = router;
