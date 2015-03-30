var
  passport = require('passport'),
  express = require('express'),
  login = require('connect-ensure-login')

var sessions = {}

sessions.loginForm = function (req, res) {
  res.render('login')
}

sessions.login = passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })

sessions.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}

sessions.account = [
  login.ensureLoggedIn(),
  function (req, res) {
    res.render('account', { user: req.user })
  }
]

module.exports = function () {
  var router = express.Router()
  router.get('/login', sessions.loginForm)
  router.post('/login', sessions.login)
  router.get('/logout', sessions.logout)
  router.get('/account', sessions.account)
  return router
}
