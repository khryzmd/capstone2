// Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

// Route for creating order
router.post("/checkout", verify, orderController.checkout);

// Route for retrieving logged in user's orders
router.get("/my-orders", verify, orderController.myOrders); 

// Route for retrieving all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.allOrders)


// Export Route System
module.exports = router;