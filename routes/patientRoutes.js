const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middleware/protect');  // Assuming this is the JWT verification middleware
const roleAccess = require('../middleware/roleacess');  // Assuming this is the role access middleware

// Route to create a new patient (only accessible by Manager)
router.post('/create-patient', authenticate, roleAccess("Manager"), patientController.createPatient);

// Route to get all patients (accessible to any authenticated user)
router.get('/get-patients', authenticate, patientController.getAllPatients);

// Route to get a patient by ID (accessible to any authenticated user)
router.get('/get-patient/:id', authenticate, patientController.getPatientById);

// Route to update a patient by ID (only accessible by Manager)
router.put('/edit-patient/:id', authenticate, roleAccess("Manager"), patientController.updatePatient);

// Route to delete a patient by ID (only accessible by Manager)
router.delete('/del-patient/:id', authenticate, roleAccess("Manager"), patientController.deletePatient);

module.exports = router;
