// Dependencies and Modules
const Cart = require("../models/Cart");
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
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            existingCart = new Cart({
                userId: req.user.id,
                cartItems: [],
                totalPrice: 0
            });
        }

        let cartItemIndex = existingCart.cartItems.findIndex(item => item.productId === req.body.productId);

        if (cartItemIndex !== -1) {
            existingCart.cartItems[cartItemIndex].quantity += req.body.quantity;
            existingCart.cartItems[cartItemIndex].subtotal = existingCart.cartItems[cartItemIndex].quantity * req.body.price;
        } else {
            existingCart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.quantity * req.body.price
            });
        }

        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        return existingCart.save()
        .then(savedCart => {
            res.status(201).send({
                message: "Item added to cart successfully",
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));
    } catch (err) {
        errorHandler(err, req, res);
    }
};

// Change product quantities in cart
module.exports.updateCartQuantity = async (req, res) => {
    try {
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            return res.status(404).send({
                message: 'Cart not found for the user'
            });
        }

        let cartItem = existingCart.cartItems.find(item => item.productId === req.body.productId);

        if (cartItem) {
            cartItem.quantity = req.body.quantity;
            cartItem.subtotal = cartItem.quantity * req.body.price;
        } else {
            existingCart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.quantity * req.body.price
            });
        }

        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        return existingCart.save()
        .then(savedCart => {
            res.status(200).send({
                message: 'Item quantity updated successfully',
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));  
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Error updating cart',
            error: err.message
        });
    }
};

// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
    try {
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            return res.status(404).send({
                message: 'Cart not found for the user'
            });
        }

        let cartItem = existingCart.cartItems.find(item => item.productId === req.params.productId);

        if (cartItem) {
            existingCart.cartItems = existingCart.cartItems.filter(item => item.productId !== req.params.productId);
        } else {
            return res.status(404).send({
                message: "Item not found in cart"
            });
        }

        existingCart.totalPrice = existingCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        return existingCart.save()
        .then(savedCart => {
            res.status(200).send({
                message: 'Item removed from cart successfully',
                updatedCart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Error updating cart',
            error: err.message
        });
    }
};

// Clear Cart
module.exports.clearCart = async (req, res) => {
    try {
        let existingCart = await Cart.findOne({ userId: req.user.id });

        if (!existingCart) {
            return res.status(404).send({
                message: 'Cart not found for the user'
            });
        }

        if (existingCart.cartItems.length > 0) {
            existingCart.cartItems = [];
            existingCart.totalPrice = 0;
        } else {
            return res.status(200).send({
                message: 'Cart is already empty',
                cart: existingCart
            });
        }

        return existingCart.save()
        .then(savedCart => {
            res.status(200).send({
                message: 'Cart cleared successfully',
                cart: savedCart
            });
        })
        .catch(error => errorHandler(error, req, res));

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Error updating cart',
            error: err.message
        });
    }
};
