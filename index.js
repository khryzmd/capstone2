// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
// const passport = require('passport');
// const session = require('express-session');
// require('./passport.js');
/*const cors = require("cors");*/
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Environment Setup
require("dotenv").config();

// Server setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/*const corsOptions = {
	origin: ["http://localhost:8000"],
	// methods: ["GET", "POST"],
	// allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
	// Provides a status code to use for successful OPTIONS request
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));*/

// Google Login
/*app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());*/

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// Backend Routes
app.use("/b3/users", userRoutes);
app.use("/b3/products", productRoutes);
app.use("/b3/cart", cartRoutes);
app.use("/b3/orders", orderRoutes);

// Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4003, () => console.log(`API is now online on port ${process.env.PORT || 4003}`));
}

module.exports = { app, mongoose };