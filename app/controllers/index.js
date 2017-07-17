/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    jwt = require('jsonwebtoken');
    _ = require('underscore');
    var config = require('../../config/config');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = function(req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    var headerBearer = req.headers.authorization;
    var token = headerBearer.split(' ')[1];
    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          res.json({ status: false,
            message: 'Authentication failed' });
        }
        res.json({ status: true });
      });
    }
    // res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = function(req, res) {
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};