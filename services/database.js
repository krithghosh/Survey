const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(callback){
  console.log('Db connected')
});