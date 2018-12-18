const mongoose = require('mongoose')
const { Schema } = mongoose

const User = mongoose.model('User', 
	new Schema({
	    google_id: {type: String, required: true, unique: true},
	    name: {type: String, required: true}
	}, {_id: true})
);

const useCases = {
	userExists: async (google_id, name, done) => {
		const existingUser = await useCases.findUser(google_id);
		if(existingUser.data) {
			return done(null, existingUser.data);
		}
		const addedUser = await useCases.addUser(google_id, name);
		if(addedUser.data){
			done(null, addedUser.data);
		}
	},

	userById: async (id, done) => {
		const user = await useCases.getUserById(id);
		if(user.data) {
			done(null, user.data);
		}
	},

	getUserById: async (id) => {
		return await User.findById(id)
				.then(data => ({'data': data, 'error': null}))
				.catch(error => ({'data': null, 'error': error.message}));
	},

	findUser: async (google_id) => {
		return await User.findOne({google_id: google_id})
				.then(data => ({'data': data, 'error': null}))
				.catch(error => ({'data': null, 'error': error.message}));
	},
	addUser: async (google_id, name) => {
		return await User.create({google_id: google_id, name: name})
				.then(data => ({'data': data, 'error': null}))
				.catch(error => ({'data': null, 'error': error.message}));
	}
}

module.exports = useCases;