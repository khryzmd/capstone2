// Dependencies and Modules
const Cart = require("../models/Cart");
const User = require("../models/User");
const { errorHandler } = require("../auth");

// Retrieve user's cart
module.exports.getCart = (req, res) => {
    return Cart.findOne({ userId:req.user.id })
    .then(cart => {
        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }
        return res.status(200).send({
            cart: cart
        });
    })
    .catch(err => {
        errorHandler(err, req, res);
    });
};

// Add to Cart
module.exports.addToCart = async (req, res) => {
    try {
        // Find the user's cart based on userId
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            // Create a new cart if none exists for the user
            existingCart = new Cart({
                userId: req.user.id,
                cartItems: [],
                totalPrice: 0
            });
        }

        // Check if the cart's cartItems array already contains the product id
        let cartItemIndex = existingCart.cartItems.findIndex(item => item.productId === req.body.productId);

        if (cartItemIndex !== -1) {
            // If the product already exists in the cart, update quantity and subtotal
            existingCart.cartItems[cartItemIndex].quantity += req.body.quantity;
            existingCart.cartItems[cartItemIndex].subtotal = existingCart.cartItems[cartItemIndex].quantity * req.body.price;
        } else {
            // If the product does not exist in the cart, add it as a new cartItem
            existingCart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.quantity * req.body.price
            });
        }

        // Update the totalPrice of the cart
        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        const savedCart = await existingCart.save();

        // Respond with the saved cart
        res.status(201).send({
            message: "Item added to cart successfully",
            cart: savedCart
        });

    } catch (err) {
        // Handle any errors
        errorHandler(err, req, res);
    }
};

// Change product quantities in cart
module.exports.updateCartQuantity = async (req, res) => {
    try {
        // Find the user's cart based on userId
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            // If no cart exists for the user, send a message indicating no cart found
            return res.status(404).send({
                message: 'Cart not found for the user'
            });
        }

        // Check if the cart's cartItems array contains the productId to update
        let cartItem = existingCart.cartItems.find(item => item.productId === req.body.productId);

        if (cartItem) {
            // If the product exists in the cart, update quantity and subtotal
            cartItem.quantity = req.body.quantity;
            cartItem.subtotal = cartItem.quantity * req.body.price;
        } else {
            // If the product does not exist in the cart, add it as a new cartItem
            existingCart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.quantity * req.body.price
            });
        }

        // Update the totalPrice of the cart
        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        const savedCart = await existingCart.save();

        // Respond with the updated cart contents
        res.status(200).send({
            message: 'Item quantity updated successfully',
            cart: savedCart
        });

    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).send({
            message: 'Error updating cart',
            error: err.message
        });
    }
};


