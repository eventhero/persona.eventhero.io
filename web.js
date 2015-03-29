/**
 * Module dependencies.
 */
var express = require('express')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , errorhandler = require('errorhandler')
  , passport = require('passport')

// Express configuration

var app = express();
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser('secret')) // TODO: specify options https://www.npmjs.com/package/cookie
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'keyboard cat'
})) // TODO: specify session cookie options https://github.com/expressjs/session

/*
 app.use(function(req, res, next) {
 console.log('-- session --');
 console.dir(req.session);
 console.log('-------------');
 next()
 });
 */
app.use(passport.initialize());
app.use(passport.session());
app.use(errorhandler());

// Passport configuration

require('./auth');

// Routing
var oauth2 = require('./routes/oauth2');
var sessions = require('./routes/sessions');
var api = require('./routes/api');

app.get('/', function(req, res) {
  res.send('OAuth 2.0 Server');
});
app.use('/sessions', sessions());
app.use('/oauth', oauth2());
app.use('/api', api());

app.listen(3000);
