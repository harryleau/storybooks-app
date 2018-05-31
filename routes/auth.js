const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // successful authentication, redirect dashboard
    res.redirect('/dashboard');
  }
);

router.get('/verify', (req, res) => {
  if(req.user) {
    // if authorized, user is set to req.user
    console.log(req.user);
  } else {
    console.log('not auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;