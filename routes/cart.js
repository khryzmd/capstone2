// Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth.js");

// Routing Component
const router = express.Router();

// Route for retrieving user's cart
router.get("/get-cart", verify, cartController.getCart);

// Route for adding to cart
router.post("/add-to-cart", verify, cartController.addToCart); 

// Route for changing product quantities in cart
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Export Route System
module.exports = router;