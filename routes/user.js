// Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
// const passport = require('passport');
const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");

// Routing Component
const router = express.Router();

//  Route for user registration
router.post("/register", userController.registerUser);

//  Route for user authentication
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getDetails);

/*//  Google Login
//  Route for initiating the Google OAuth consent screen
router.get('/google',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	}
));

//  Route for callback URL for Google OAuth authentication
router.get('/google/callback', 
	passport.authenticate('google', {
		failureRedirect: '/users/failed'
	}),
	function(req, res){
		res.redirect('/users/success')
	}
);

//  Route for failed Google OAuth authentication
router.get("/failed", (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed");
})

//  Route for successful Google Oauth authentication
router.get("/success", (req, res) => {
	console.log("You are logged in");
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
})

//  Route for logging out of the application
router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if(err){
			console.log('Error while destroying session:', err);
		}else{
			req.logout(() => {
				res.redirect('/');
			})
		}
	})
})*/

// PATCH route for setting user as admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.setAsAdmin);

// PATCH route for updating the password
router.patch('/update-password', verify, userController.updatePassword);

//  Export Route System
module.exports = router;