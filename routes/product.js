// Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

// Route for creating a product
router.post("/", verify, verifyAdmin, productController.addProduct); 

// Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts); 

// Route for retrieving active products
router.get("/active", productController.getAllActive);

// Route for retrieving a single product
router.get("/:productId", productController.getProduct);

// Route for updating a product (Admin)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Route to archiving a product (Admin)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route to activating a product (Admin)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);


// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;