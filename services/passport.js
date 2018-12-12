const passport = require('passport');
const keys = require('../config/keys');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schemas/user')
const {isEmpty} = require('../utils')

passport.serializeUser((_user, done) => {
	done(null, _user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(user => {
			done(null, user);
		});
});

passport.use(new googleStrategy({
	clientID: keys.GoogleClientID,
	clientSecret: keys.GoogleClientSecret,
	callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({google_id: profile.id})
				.then(existingUser => {
					if(existingUser) {
						done(null, existingUser);
					} else {
						User.create({google_id: profile.id, name: profile.displayName})
							.then(user => done(null, user));
					}
				})
				.catch(error => console.log(error.message));
}));