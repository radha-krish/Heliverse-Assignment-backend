const Order = require('../models/Orders');
const Patient = require('../models/Patient');
const User = require("../models/User");

// Controller for creating multiple orders
exports.createMultipleOrders = async (req, res) => {
  try {
    const {
      patientIds, // Array of patient IDs
      pantryStaffId
,   // Single pantry ID
      session,    // Session (morning, afternoon, night)
      foodDetails, // Array of food orders (one per patient, in the same order as patientIds)
      cookingSpecialNotes, // Optional cooking notes
      deliverySpecialNotes, // Optional delivery notes
      specialNotes, // General special notes
    } = req.body;
 console.log(patientIds)
    // Validate pantry staff
    const pantry = await User.findById(pantryStaffId);
    if (!pantry) {
      return res.status(404).json({ message: "Pantry staff not found." });
    }

    // Validate that foodDetails matches the number of patients
    if (patientIds.length !== foodDetails.length) {
      return res.status(400).json({ message: "Mismatch between patientIds and foodDetails array lengths." });
    }

    // Prepare orders array
    const orders = [];
    for (let i = 0; i < patientIds.length; i++) {
      const patientId = patientIds[i];
      console.log(foodDetails)
      const patientFoodDetails = foodDetails[i].meals; // Food orders for the specific patient

      // Validate patient
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: `Patient with ID ${patientId} not found.` });
      }

      // Validate that food details for the patient is an array
      if (!Array.isArray(patientFoodDetails)) {
        return res.status(400).json({
          message: `Food details for patient with ID ${patientId} should be an array.`,
        });
      }

      // Prepare the order
      const newOrder = new Order({
        patientId,
        pantryId:pantryStaffId,
        session,
        foodDetails: patientFoodDetails, // Array of food orders for this patient
        cookingSpecialNotes,
        deliverySpecialNotes,
        specialNotes,
        orderStatus: 'pending', // Default to pending
        deliveryStatus: 'pending', // Default to pending
        orderPlacedAt: new Date(),
      });

      // Save the order
      await newOrder.save();
      orders.push(newOrder);
    }

    // Respond with the created orders
    res.status(201).json({
      message: "Orders created successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getOrdersByFilters = async (req, res) => {
  try {
    const { inputDate, orderStatus, deliveryStatus, session, pantryId } = req.body;

    // Build the query dynamically based on provided fields
    const query = {};

    // Add date filter if provided
    if (inputDate) {
      const startDate = new Date(inputDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(inputDate);
      endDate.setHours(23, 59, 59, 999);

      query.orderPlacedAt = { $gte: startDate, $lte: endDate };
    }

    // Add order status filter if provided
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    // Add delivery status filter if provided
    if (deliveryStatus) {
      query.deliveryStatus = deliveryStatus;
    }

    // Add session filter if provided
    if (session) {
      query.session = session; // Assuming the `session` field exists in the `Order` schema
    }

    // Add pantryId filte
    // r if provided
    if (pantryId=="pantry") {
      console.log(req.user.id,"hi")
      query.pantryId = req.user.id; // Assuming `pantryId` is a valid field in the `Order` schema
    }
    if (pantryId=="deliver") {
      console.log(req.user.id,"hi")
      query.deliveryId = req.user.id; // Assuming `pantryId` is a valid field in the `Order` schema
    }


    // Fetch orders based on the built query and populate details
    const orders = await Order.find(query)
      .populate({
        path: 'patientId',
        select: 'name age roomNumber bedNumber', // Select fields to include for the patient
      })
      .populate({
        path: 'pantryId',
        select: 'name role contactInfo location', // Select fields to include for the pantry staff
      })
      .populate({
        path: 'deliveryId',
        select: 'name role contactInfo location', // Select fields to include for the delivery personnel
      });

    // Check if orders are found
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found matching the criteria." });
    }

    // Respond with the fetched and populated orders
    res.status(200).json({
      message: "Orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


exports.updateOrdersStatusAndDeliveryStatus = async (req, res) => {
  try {
    const { orderIds, orderStatus, deliveryStatus, deliveryId ,deliverySpecialNotes} = req.body;

    // Validate input
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "Order IDs must be provided and should be an array." });
    }
    
    if (!orderStatus && !deliveryStatus && !deliveryId) {
      return res.status(400).json({ message: "At least one of orderStatus, deliveryStatus, or deliveryId must be provided." });
    }

    // Initialize the update fields
    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (deliveryStatus) updateFields.deliveryStatus = deliveryStatus;
    if (deliveryId) updateFields.deliveryId = deliveryId;
    if (deliverySpecialNotes) updateFields.deliverySpecialNotes = deliverySpecialNotes;


    // Loop through orderIds and update the orders
    const updatedOrders = [];
    for (let i = 0; i < orderIds.length; i++) {
      const orderId = orderIds[i];

      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: `Order with ID ${orderId} not found.` });
      }

      // Update the order with the provided fields
      Object.assign(order, updateFields);
      await order.save();

      updatedOrders.push(order);
    }

    // Respond with the updated orders
    res.status(200).json({
      message: "Orders updated successfully.",
      orders: updatedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
