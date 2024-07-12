// Package for configuring environment variables.
require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Passport to use the Google Auth 2.0 authentication strategy
passport.use(new GoogleStrategy({
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: "http://ec2-13-59-17-101.us-east-2.compute.amazonaws.com/b3/users/google/callback",
	passReqToCallback: true
},
// Callback function gets executed when a user is successfully authenticated

function(request, accessToken, refreshToken, profile, done){
	return done(null, profile);
}
));

// Serialize the user object into a session
passport.serializeUser(function(user, done){
	done(null, user);
});

// Deserialize the user object from the session
passport.deserializeUser(function(user, done){
	done(null, user);
});