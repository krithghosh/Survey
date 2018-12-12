const mongoose = require('mongoose')
const { Schema } = mongoose

const User = mongoose.model('User', 
	new Schema({
	    google_id: {type: String, required: true, unique: true},
	    name: {type: String, required: true}
	}, {_id: true})
);

module.exports = {
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