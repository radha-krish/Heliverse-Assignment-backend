const mongoose = require("mongoose");

// Schema for individual food items
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the food item
  quantity: { type: String, required: true }, // Quantity (e.g., "1 bowl", "2 slices")
  instructions: { type: String, required: false }, // Specific instructions (e.g., "no salt", "low sugar")
});

// Meals Schema
const mealsSchema = new mongoose.Schema(
  {
    patientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient", 
      required: true 
    }, // Reference to the patient
    morning: [foodItemSchema], // Morning meal details
    afternoon: [foodItemSchema], // Afternoon meal details
    night: [foodItemSchema], // Night meal details
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Meals = mongoose.model("Meals", mealsSchema);

module.exports = Meals;
