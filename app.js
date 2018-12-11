const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const googleStrategy = require('passport-google-oauth20').Strategy;
const port = process.env.PORT || 5000;
const publicDir = require('path').join(__dirname,'/public');
const viewDir = __dirname + '/views';
require('./config/database.js');

var app = express();

passport.use(new googleStrategy());
app.use(cors())
app.options('*', cors())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', viewDir);
app.set('view engine', 'ejs');
app.use(express.static(publicDir));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});

require('./routes/index.js')(app);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.log('error: ', err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
	console.log('Listening to port: ',port);
})

module.exports = app;