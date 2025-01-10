const express = require('express');
const router = express.Router();
const roleAccess=require("../middleware/roleacess")
const authenticate = require('../middleware/protect');  // Assuming this is the JWT verification middleware

const { createMultipleOrders,getOrdersByFilters ,updateOrdersStatusAndDeliveryStatus} = require('../controllers/orderController');

// Route for creating multiple orders
router.post('/orders',authenticate,roleAccess("Manager"), createMultipleOrders);
router.post("/filter",authenticate,getOrdersByFilters)
router.put("/status",authenticate,updateOrdersStatusAndDeliveryStatus)

module.exports = router;
