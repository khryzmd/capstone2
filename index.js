// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
require('./passport.js');
/*const cors = require("cors");*/
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

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
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

// Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
}

module.exports = { app, mongoose };