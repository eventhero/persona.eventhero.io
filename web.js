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
    , site = require('./site')
    , oauth2 = require('./oauth2')
    , user = require('./user')
    , client = require('./client')
    , util = require('util')

// Express configuration

var app = express();
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser('secret')) // TODO: specify options https://www.npmjs.com/package/cookie
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'keyboard cat' })) // TODO: specify session cookie options https://github.com/expressjs/session

/*
 app.use(function(req, res, next) {
 console.log('-- session --');
 console.dir(req.session);
 //console.log(util.inspect(req.session, true, 3));
 console.log('-------------');
 next()
 });
 */
app.use(passport.initialize());
app.use(passport.session());
app.use(errorhandler());

// Passport configuration

require('./auth');

app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);
app.get('/api/clientinfo', client.info);

app.listen(3000);
