const passport = require('passport');
const keys = require('../config/keys');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schemas/user')
const {isEmpty} = require('../utils')

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.userById(id, done);
});

passport.use(new googleStrategy({
	clientID: keys.GoogleClientID,
	clientSecret: keys.GoogleClientSecret,
	callbackURL: '/auth/google/callback',
	proxy: true
}, (accessToken, refreshToken, profile, done) => {
	User.userExists(profile.id, profile.displayName, done);
}));