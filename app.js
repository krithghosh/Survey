const express = require('express');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const publicDir = require('path').join(__dirname,'/public');
const viewDir = __dirname + '/views';
require('./services/passport');
require('./services/database');

var app = express();

app.use(cookieSession({maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey]}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.options('*', cors());
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

require('./routes/auth')(app);
require('./routes/user')(app);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  // If theres no matching routes
  app.get('*', (req, res) => {
    res.sendFile(require('path').resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

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