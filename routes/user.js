const keys = require('../config/keys');
const User = require('../schemas/user');
const requireLogin = require('../middlewares/requireLogin');
const stripe = require('stripe')(keys.stripeSecretKey);

module.exports = (app) => {

	app.post('/api/stripe', requireLogin, async (req, res) => {
		const stripeRes = await stripe.charges.create({
			amount: 500,
			currency: 'USD',
			description: '$5 for 5 emails',
			source: req.body.id,
		});
		
		req.user.credits += 5;
		const user = await User.updateCredit(req.user);
		res.send(user);
	});
};