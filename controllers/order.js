// Dependencies and Modules
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");


// Create order
module.exports.checkout = async (req, res) => {
	try {
		let existingCart = await Cart.findOne({ userId: req.user.id });

		if (!existingCart) {
			return res.status(404).send({
				message: "Cart not found"
			})
		}

		if (existingCart.cartItems.length === 0) {
			return res.status(404).send({
				message: "No Items to Checkout"
			})
		} 

		let order = new Order({
			userId: req.user.id,
			productsOrdered: existingCart.cartItems,
			totalPrice: existingCart.totalPrice
		})

		return order.save()
		.then(savedOrder => {
			res.status(201).send({
				message: "Ordered Successfully",

			});
		})
		.catch(error => errorHandler(error, req, res));
	} catch (err) {
		errorHandler(err, req, res);
	}
};


// Retrieve logged in user's orders
module.exports.myOrders = (req, res) => {
	return Order.find({ userId:req.user.id })
	.then(order => {
		if (!order) {
			return res.status(404).send({
				message: "Order not found"
			});
		}
		return res.status(200).send({
			orders: order
		});
	})
	.catch(err => {
		errorHandler(err, req, res);
	});
};

// Retrieve all user's orders
module.exports.allOrders = (req, res) => {
	return Order.find({})
	.then(order => {
		if (!order) {
			return res.status(404).send({
				message: "No orders found"
			});
		}
		return res.status(200).send({
			orders: order
		});
	})
	.catch(err => {
		errorHandler(err, req, res);
	});
};

