const mongoose = require('mongoose');

// Schema for individual food items
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the food item
  quantity: { type: String, required: true }, // Quantity (e.g., "1 bowl", "2 slices")
  instructions: { type: String, required: false }, // Specific instructions (e.g., "no salt", "low sugar")
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    }, // Reference to the patient
    pantryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Reference to the pantry staff handling the order
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }, // Reference to the delivery personnel handling the order
    session: {
      type: String,
      enum: ['morning', 'afternoon', 'night'],
      required: true,
    }, // Session of the meal (morning, afternoon, night)
    foodDetails: [foodItemSchema], // Array to store the food items for the selected session
    orderStatus: {
      type: String,
      enum: ['pending', 'preparing', 'completed'],
      default: 'pending',
    }, // Status of the order
    deliveryStatus: {
      type: String,
      enum: ['pending', 'inProgress', 'delivered'],
      default: 'pending',
    }, // Status of the delivery
    orderPlacedAt: {
      type: Date,
      required: true,
      default: Date.now,
    }, // Timestamp when the order is placed
    orderCookedAt: {
      type: Date,
      required: false,
    }, // Timestamp for when the order starts cooking
    orderDeliveredAt: {
      type: Date,
      required: false,
    }, // Timestamp for when the order is delivered
    cookingSpecialNotes: {
      type: String,
      required: false,
      default: '',
    }, // Special notes related to cooking (e.g., "low salt", "extra spicy")
    deliverySpecialNotes: {
      type: String,
      required: false,
      default: '',
    }, // Special notes related to delivery (e.g., "delivered before 12 PM", "patient prefers to be called upon arrival")
    specialNotes: {
      type: String,
      required: false,
      default: '',
    }, // General special notes
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Virtual field to extract just the date part from orderPlacedAt
orderSchema.virtual('orderDate').get(function () {
  return this.orderPlacedAt.toISOString().split('T')[0]; // Extracts date part (YYYY-MM-DD)
});

// Compound index to ensure unique combination of patientId, session, and order date
orderSchema.index({ patientId: 1, session: 1, orderDate: 1 }, { unique: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
