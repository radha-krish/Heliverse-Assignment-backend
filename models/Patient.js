const mongoose = require('mongoose');

// Patient schema definition
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Patient's name
  diseases: { type: [String], required: true }, // Patient's diseases as an array
  allergies: { type: [String], required: true }, // Allergies information as an array
  roomNumber: { type: String, required: true }, // Room number
  bedNumber: { type: String, required: true }, // Bed number
  floorNumber: { type: String, required: true }, // Floor number
  age: { type: Number, required: true }, // Age of the patient
  gender: { type: String, required: true }, // Gender of the patient
  contactInfo: { type: String, required: true }, // Contact information (phone number)
  emergencyContact: { type: String, required: true }, // Emergency contact number
  others: { type: Map, of: String }, // Additional dynamic fields in a Map
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
});

module.exports = mongoose.model('Patient', patientSchema);
